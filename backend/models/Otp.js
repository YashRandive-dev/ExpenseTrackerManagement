const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  purpose: { type: String, enum: ["verify", "reset"], required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

OtpSchema.index({ email: 1, purpose: 1 }, { unique: true });
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired codes

module.exports = mongoose.model("Otp", OtpSchema);
