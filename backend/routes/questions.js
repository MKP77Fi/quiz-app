// backend/routes/questions.js

const express = require("express");
const router = express.Router();

// Tuodaan logiikka kontrollerista (MVC-malli)
const {
  getAllQuestions,    // Admin: listaus
  getRandomQuestions, // Harjoittelija/Tentti: satunnaiset
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionsController");

// Tuodaan suojaus-middlewaret
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

/**
 * ------------------------------------------------------------------
 * PUBLIC / USER ROUTES
 * ------------------------------------------------------------------
 */

// GET /api/questions/random?amount=1
// Hakee satunnaisia kysymyksiä harjoittelua tai tenttiä varten.
// Vaatii kirjautumisen (verifyToken), mutta ei admin-oikeuksia.
router.get("/random", verifyToken, getRandomQuestions);

/**
 * ------------------------------------------------------------------
 * ADMIN ROUTES (CRUD)
 * ------------------------------------------------------------------
 * Nämä toiminnot on tarkoitettu vain ylläpitäjille.
 * Suojattu verifyAdmin-middlewarella.
 */

// GET /api/questions
// Hakee KAIKKI kysymykset hallintapaneelin listaukseen.
router.get("/", verifyToken, verifyAdmin, getAllQuestions);

// POST /api/questions
// Luo uusi kysymys
router.post("/", verifyToken, verifyAdmin, createQuestion);

// PUT /api/questions/:id
// Muokkaa kysymystä
router.put("/:id", verifyToken, verifyAdmin, updateQuestion);

// DELETE /api/questions/:id
// Poista kysymys
router.delete("/:id", verifyToken, verifyAdmin, deleteQuestion);

module.exports = router;