// backend/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error("💥 Virhe middleware:", err.message);

  // Logitus tietokantaan, jos mahdollista
  if (req.logEvent) {
    req.logEvent("error", "server.error", err.message, {
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Sisäinen palvelinvirhe",
  });
};
