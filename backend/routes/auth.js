// backend/routes/auth.js

const express = require("express");
const router = express.Router();

// Tuodaan tarvittavat funktiot kontrollerista
const { login } = require("../controllers/authController");

/**
 * ------------------------------------------------------------------
 * AUTHENTICATION ROUTES (Määrittely 11.4)
 * ------------------------------------------------------------------
 * Base URL: /api/auth (määritelty server.js:ssä)
 */

// POST /api/auth/login
// Vastaanottaa { username, password } ja palauttaa JWT-tokenin.
router.post("/login", login);

// HUOM:
// - Logout hoidetaan frontendissä poistamalla token (stateless).
// - Register-toimintoa ei ole tässä, koska käyttäjien luonti on 
//   rajattu Admin-toiminnoksi (ks. userController /api/users).

module.exports = router;