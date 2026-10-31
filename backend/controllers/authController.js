const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Session = require("../models/Session");
const { issueOtp, verifyOtp, OtpError } = require("../utils/otp");
const { parseDevice } = require("../utils/device");

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CNY", "AUD", "CAD", "CHF", "SGD", "AED", "SAR", "ZAR", "BRL", "MXN", "KRW", "NZD", "SEK", "NOK", "TRY", "RUB", "IDR", "PHP", "THB", "MYR", "PKR", "BDT", "LKR", "NGN", "KES", "EGP"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normEmail = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");
const isStr = (v) => typeof v === "string";

/** Creates a device session and returns the auth payload for it. */
const startSession = async (user, req) => {
  const session = await Session.create({ user: user._id, ...parseDevice(req) });
  const token = jwt.sign({ id: user._id, sid: session._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { id: user._id, user, token };
};

const handleError = (res, err, label) => {
  if (err instanceof OtpError) return res.status(err.status).json({ message: err.message });
  if (err.code === 11000) return res.status(400).json({ message: "Email is already registered" });
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors)[0].message });
  }
  console.error(`${label}:`, err);
  return res.status(500).json({ message: `Error: ${label}` });
};

const checkPassword = (password) =>
  !isStr(password) || password.length < 8 ? "Password must be at least 8 characters" : null;

// POST /api/v1/auth/register  -> sends a verification OTP, no token until verified
exports.registerUser = async (req, res) => {
  try {
    const { fullName, password, profileImageUrl } = req.body;
    const email = normEmail(req.body.email);

    if (!isStr(fullName) || !fullName.trim() || !email || !isStr(password) || !password) {
      return res.status(400).json({ message: "Full name, email and password are required" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    const pwErr = checkPassword(password);
    if (pwErr) return res.status(400).json({ message: pwErr });

    let user = await User.findOne({ email });
    if (user && user.emailVerified) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    if (user) {
      // abandoned, never-verified signup: let the person retry with fresh details
      user.fullName = fullName.trim();
      user.password = password;
      user.profileImageUrl = profileImageUrl || null;
      await user.save();
    } else {
      user = await User.create({
        fullName: fullName.trim(),
        email,
        password,
        profileImageUrl: profileImageUrl || null,
      });
    }

    await issueOtp(email, "verify");
    res.status(201).json({ requiresVerification: true, email, message: "Verification code sent to your email" });
  } catch (err) {
    handleError(res, err, "registering user");
  }
};

// POST /api/v1/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const email = normEmail(req.body.email);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Code expired or not found. Please request a new one." });

    await verifyOtp(email, "verify", req.body.otp);
    user.emailVerified = true;
    await user.save();

    res.status(200).json(await startSession(user, req));
  } catch (err) {
    handleError(res, err, "verifying email");
  }
};

// POST /api/v1/auth/resend-otp   { email, purpose: verify | reset }
exports.resendOtp = async (req, res) => {
  try {
    const email = normEmail(req.body.email);
    const purpose = req.body.purpose;
    if (!["verify", "reset"].includes(purpose)) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const user = await User.findOne({ email });
    // same response whether or not the account exists (no account enumeration)
    if (user && (purpose !== "verify" || !user.emailVerified)) await issueOtp(email, purpose);
    res.status(200).json({ message: "If the account exists, a new code has been sent" });
  } catch (err) {
    handleError(res, err, "sending code");
  }
};

// POST /api/v1/auth/login
exports.loginUser = async (req, res) => {
  try {
    const email = normEmail(req.body.email);
    const { password } = req.body;
    if (!email || !isStr(password) || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      try {
        await issueOtp(email, "verify");
      } catch (e) {
        if (!(e instanceof OtpError && e.status === 429)) throw e; // a code was just sent; reuse it
      }
      return res.status(403).json({
        requiresVerification: true,
        email,
        message: "Please verify your email. We've sent you a code.",
      });
    }

    res.status(200).json(await startSession(user, req));
  } catch (err) {
    handleError(res, err, "logging in");
  }
};

// POST /api/v1/auth/forgot-password   { email }
exports.forgotPassword = async (req, res) => {
  try {
    const email = normEmail(req.body.email);
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Please enter a valid email address" });
    if (await User.exists({ email })) await issueOtp(email, "reset");
    res.status(200).json({ message: "If the account exists, a reset code has been sent" });
  } catch (err) {
    handleError(res, err, "sending code");
  }
};

// POST /api/v1/auth/reset-password   { email, otp, newPassword }
exports.resetPassword = async (req, res) => {
  try {
    const email = normEmail(req.body.email);
    const pwErr = checkPassword(req.body.newPassword);
    if (pwErr) return res.status(400).json({ message: pwErr });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Code expired or not found. Please request a new one." });

    await verifyOtp(email, "reset", req.body.otp);
    user.password = req.body.newPassword;
    user.emailVerified = true;
    await user.save();
    await Session.deleteMany({ user: user._id }); // sign out everywhere after a reset

    res.status(200).json({ message: "Password updated. Please log in with your new password." });
  } catch (err) {
    handleError(res, err, "resetting password");
  }
};

// GET /api/v1/auth/getUser
exports.getUserInfo = async (req, res) => {
  res.status(200).json(req.user);
};

// PUT /api/v1/auth/profile   { fullName?, profileImageUrl?, currency? }
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, profileImageUrl, currency } = req.body;
    if (currency !== undefined) {
      if (!CURRENCIES.includes(currency)) return res.status(400).json({ message: "Unsupported currency" });
      req.user.currency = currency;
    }
    if (fullName !== undefined) {
      if (!isStr(fullName) || !fullName.trim()) return res.status(400).json({ message: "Full name is required" });
      req.user.fullName = fullName.trim();
    }
    if (profileImageUrl !== undefined) req.user.profileImageUrl = profileImageUrl || null;
    await req.user.save();
    res.status(200).json(req.user);
  } catch (err) {
    handleError(res, err, "updating profile");
  }
};

// PUT /api/v1/auth/change-password   { currentPassword, newPassword }
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const pwErr = checkPassword(newPassword);
    if (pwErr) return res.status(400).json({ message: pwErr });

    const user = await User.findById(req.user._id);
    if (!isStr(currentPassword) || !(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    // keep this device signed in, end every other one
    await Session.deleteMany({ user: user._id, _id: { $ne: req.sessionId } });
    res.status(200).json({ message: "Password changed. Other devices were signed out." });
  } catch (err) {
    handleError(res, err, "changing password");
  }
};

// POST /api/v1/auth/logout
exports.logout = async (req, res) => {
  await Session.deleteOne({ _id: req.sessionId });
  res.status(200).json({ message: "Logged out" });
};

// GET /api/v1/auth/sessions
exports.listSessions = async (req, res) => {
  const sessions = await Session.find({ user: req.user._id }).sort({ lastActive: -1 });
  res.status(200).json(
    sessions.map((s) => ({
      id: s._id,
      deviceName: s.deviceName,
      browser: s.browser,
      os: s.os,
      ip: s.ip,
      loggedInAt: s.createdAt,
      lastActive: s.lastActive,
      current: s._id.toString() === req.sessionId,
    }))
  );
};

// DELETE /api/v1/auth/sessions/:id   (sign out one device)
exports.revokeSession = async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ message: "Invalid session" });
  const r = await Session.deleteOne({ _id: req.params.id, user: req.user._id });
  if (!r.deletedCount) return res.status(404).json({ message: "Session not found" });
  res.status(200).json({ message: "Device signed out" });
};

// DELETE /api/v1/auth/sessions   (sign out all other devices)
exports.revokeOtherSessions = async (req, res) => {
  const r = await Session.deleteMany({ user: req.user._id, _id: { $ne: req.sessionId } });
  res.status(200).json({ message: `Signed out ${r.deletedCount} device(s)` });
};

// POST /api/v1/auth/upload-image
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
};
