// routes/auth.js
const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// Kirjautumisreitti
router.post("/login", login);

module.exports = router;
