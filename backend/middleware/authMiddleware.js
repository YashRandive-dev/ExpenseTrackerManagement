const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");

const TOUCH_INTERVAL_MS = 60 * 1000;

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    if (!decoded.sid) throw new Error("legacy token");

    // a token is only valid while its device session exists (logout / remote sign-out deletes it)
    // fetched in parallel: one DB round trip instead of two
    const [session, user] = await Promise.all([
      Session.findOne({ _id: decoded.sid, user: decoded.id }),
      User.findById(decoded.id).select("-password"),
    ]);
    if (!session) {
      return res.status(401).json({ message: "Session ended. Please log in again." });
    }
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (Date.now() - session.lastActive.getTime() > TOUCH_INTERVAL_MS) {
      session.lastActive = new Date();
      await session.save();
    }

    req.user = user;
    req.sessionId = session._id.toString();
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};
