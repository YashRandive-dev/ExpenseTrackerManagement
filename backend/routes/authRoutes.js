const express = require("express");
const c = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", c.registerUser);
router.post("/verify-email", c.verifyEmail);
router.post("/resend-otp", c.resendOtp);
router.post("/login", c.loginUser);
router.post("/forgot-password", c.forgotPassword);
router.post("/reset-password", c.resetPassword);
// public on purpose: used during sign-up, before a token exists
router.post("/upload-image", upload.single("image"), c.uploadImage);

router.get("/getUser", protect, c.getUserInfo);
router.put("/profile", protect, c.updateProfile);
router.put("/change-password", protect, c.changePassword);
router.post("/logout", protect, c.logout);
router.get("/sessions", protect, c.listSessions);
router.delete("/sessions", protect, c.revokeOtherSessions);
router.delete("/sessions/:id", protect, c.revokeSession);

module.exports = router;
