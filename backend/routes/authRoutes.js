const express = require("express");
const rateLimit = require("express-rate-limit");
const c = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const limiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message },
  });

const MIN = 60 * 1000;
// password / code guessing
const guessLimit = limiter(15 * MIN, 20, "Too many attempts. Please try again in 15 minutes.");
// anything that sends an email (protects the mail quota from being drained)
const emailLimit = limiter(60 * MIN, 10, "Too many requests. Please try again in an hour.");
// unauthenticated uploads (protects Cloudinary quota / disk)
const uploadLimit = limiter(60 * MIN, 10, "Too many uploads. Please try again in an hour.");

router.post("/register", emailLimit, c.registerUser);
router.post("/verify-email", guessLimit, c.verifyEmail);
router.post("/resend-otp", emailLimit, c.resendOtp);
router.post("/login", guessLimit, c.loginUser);
router.post("/forgot-password", emailLimit, c.forgotPassword);
router.post("/reset-password", guessLimit, c.resetPassword);
// public on purpose: used during sign-up, before a token exists
router.post("/upload-image", uploadLimit, upload.single("image"), c.uploadImage);

router.get("/getUser", protect, c.getUserInfo);
router.put("/profile", protect, c.updateProfile);
router.put("/change-password", protect, guessLimit, c.changePassword);
router.post("/logout", protect, c.logout);
router.get("/sessions", protect, c.listSessions);
router.delete("/sessions", protect, c.revokeOtherSessions);
router.delete("/sessions/:id", protect, c.revokeSession);

module.exports = router;
