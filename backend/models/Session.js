const mongoose = require("mongoose");

const SESSION_DAYS = 7;

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    deviceName: { type: String, default: "Unknown device" },
    browser: { type: String, default: "Unknown" },
    os: { type: String, default: "Unknown" },
    ip: { type: String, default: "" },
    lastActive: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + SESSION_DAYS * 864e5) },
  },
  { timestamps: true }
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", SessionSchema);
