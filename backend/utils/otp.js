const crypto = require("crypto");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("./mailer");

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

const hash = (email, purpose, code) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET).update(`${email}:${purpose}:${code}`).digest("hex");

class OtpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
exports.OtpError = OtpError;

/** Creates (or replaces) a code and emails it. Throws OtpError(429) inside the resend cooldown. */
exports.issueOtp = async (email, purpose) => {
  const existing = await Otp.findOne({ email, purpose });
  if (existing) {
    const wait = RESEND_COOLDOWN_MS - (Date.now() - existing.lastSentAt.getTime());
    if (wait > 0) throw new OtpError(`Please wait ${Math.ceil(wait / 1000)}s before requesting a new code`, 429);
  }

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  await Otp.findOneAndUpdate(
    { email, purpose },
    {
      codeHash: hash(email, purpose, code),
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
    { upsert: true, new: true }
  );

  try {
    await sendOtpEmail(email, code, purpose);
  } catch (err) {
    await Otp.deleteOne({ email, purpose });
    console.error("Failed to send OTP email:", err.message);
    throw new OtpError("Could not send the verification email. Please try again later.", 502);
  }
};

/** Consumes the code on success. Throws OtpError otherwise. */
exports.verifyOtp = async (email, purpose, code) => {
  const record = await Otp.findOne({ email, purpose });
  if (!record || record.expiresAt < new Date()) {
    throw new OtpError("Code expired or not found. Please request a new one.");
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: record._id });
    throw new OtpError("Too many incorrect attempts. Please request a new code.", 429);
  }

  const given = Buffer.from(hash(email, purpose, String(code || "").trim()));
  const real = Buffer.from(record.codeHash);
  if (given.length !== real.length || !crypto.timingSafeEqual(given, real)) {
    record.attempts += 1;
    await record.save();
    throw new OtpError("Incorrect code");
  }
  await Otp.deleteOne({ _id: record._id });
};
