const mongoose = require("mongoose");

const connectDB = async () => {
  const missing = ["MONGO_URI", "JWT_SECRET"].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(
      `Missing env var(s): ${missing.join(", ")}. Copy backend/.env.example to backend/.env and fill them in.`
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("MongoDB connected");
    // accounts created before email verification existed are treated as verified
    await mongoose.connection
      .collection("users")
      .updateMany({ emailVerified: { $exists: false } }, { $set: { emailVerified: true } });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
