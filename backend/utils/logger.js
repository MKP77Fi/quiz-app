// backend/utils/logger.js
const Log = require("../models/Log");

async function log({ level = "info", event, message = "", user = null, req = null, payload = null, meta = null }) {
  try {
    const doc = new Log({
      level,
      event,
      message,
      user: user ? { id: user._id, username: user.username, role: user.role } : undefined,
      ip: req ? (req.ip || req.headers["x-forwarded-for"] || null) : undefined,
      route: req ? req.originalUrl : undefined,
      method: req ? req.method : undefined,
      payload,
      meta
    });
    await doc.save();
  } catch (err) {
    console.error("Logger error:", err); // jos DB ei ole saatavilla, vähintään consolessa
  }
}

module.exports = { log };
