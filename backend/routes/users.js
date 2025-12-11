// backend/routes/users.js

const express = require("express");
const router = express.Router();

// Tuodaan logiikka kontrollerista
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Tuodaan keskitetyt suojaus-middlewaret
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

/**
 * ------------------------------------------------------------------
 * KÄYTTÄJÄHALLINNAN REITIT (USER ROUTES)
 * ------------------------------------------------------------------
 * Base URL: /api/users
 * Vastaa määrittelydokumentin lukuja 5.3 ja 11.4.
 */

// TÄRKEÄÄ: Sovelletaan suojausta kaikkiin tämän reitittimen polkuihin.
// 1. verifyToken: Varmistaa, että käyttäjä on kirjautunut.
// 2. verifyAdmin: Varmistaa, että käyttäjällä on ADMIN-rooli.
// Tavallisella harjoittelijalla ei ole mitään asiaa näihin toimintoihin.
router.use(verifyToken, verifyAdmin);

// GET /api/users
// Hae kaikki käyttäjät (Admin-näkymän listausta varten)
router.get("/", getUsers);

// POST /api/users
// Luo uusi käyttäjä (Admin luo tunnukset harjoittelijoille)
router.post("/", createUser);

// PUT /api/users/:id
// Päivitä käyttäjän tietoja (esim. salasanan resetointi)
router.put("/:id", updateUser);

// DELETE /api/users/:id
// Poista käyttäjä
router.delete("/:id", deleteUser);

module.exports = router;