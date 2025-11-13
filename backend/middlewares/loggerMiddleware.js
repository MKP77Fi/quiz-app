// backend/middlewares/loggerMiddleware.js
const logger = require("../utils/logger");

/**
 * Lisää jokaiseen requestiin logitusapurin:
 *   req.logEvent(level, event, message, payload?, meta?)
 */
function loggerMiddleware(req, res, next) {
  req.logEvent = async (level, event, message, payload = null, meta = null) => {
    const user =
      req.user || // authMiddleware asettaa tämän
      (req.session && req.session.user) ||
      null;

    await logger.log({
      level,
      event,
      message,
      user,
      req,
      payload,
      meta,
    });
  };
  next();
}

module.exports = loggerMiddleware;
