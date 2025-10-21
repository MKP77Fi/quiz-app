// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

// Käytetään ensisijaisesti .env-tiedoston avainta, muuten varmistusvarana sama avain kuin muualla
const SECRET_KEY = process.env.JWT_SECRET || "salainen_avain";

/**
 * Middleware-tokenin tarkistamiseen
 * Tarkistaa, onko Authorization-header mukana ja onko token kelvollinen.
 * Lisää req.user-olioon tokenista puretun käyttäjän tiedot (username, role).
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(403).json({ success: false, message: "Token puuttuu" });
  }

  try {
    // Tarkistetaan ja puretaan token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Esim. { username: "admin", role: "admin", iat: ..., exp: ... }
    next();
  } catch (err) {
    console.error("Virhe tokenin tarkistuksessa:", err.message);
    return res.status(401).json({ success: false, message: "Virheellinen tai vanhentunut token" });
  }
};

/**
 * Middleware vain admin-oikeuksia vaativille toiminnoille
 * Tarkistaa, että req.user on olemassa ja rooli on "admin".
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Ei oikeuksia tähän toimintoon" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
