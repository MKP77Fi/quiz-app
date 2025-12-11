// backend/routes/settings.js

const express = require("express");
const router = express.Router();

// Tuodaan logiikka kontrollerista (MVC-arkkitehtuuri)
// Tämä varmistaa, että "Singleton"-logiikka ja validointi tapahtuvat yhdessä paikassa
const { getSettings, updateSettings } = require("../controllers/settingsController");

// Tuodaan suojaus-middlewaret
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

/**
 * ------------------------------------------------------------------
 * ASETUSTEN REITIT (SETTINGS ROUTES)
 * ------------------------------------------------------------------
 * Base URL: /api/settings
 * Vastaa määrittelydokumentin lukua 11.4.
 */

// GET /api/settings
// Hakee tentin asetukset (kysymysmäärä ja aikaraja).
// Tämä tarvitaan, kun käyttäjä (harjoittelija) aloittaa tentin.
// Vaatii kirjautumisen, mutta ei admin-oikeuksia.
router.get("/", verifyToken, getSettings);

// PUT /api/settings
// Päivittää tentin asetukset.
// TÄRKEÄÄ: Tämä toiminto on rajattu vain ADMIN-käyttäjille (verifyAdmin).
router.put("/", verifyToken, verifyAdmin, updateSettings);

module.exports = router;