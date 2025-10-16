// backend/routes/questions.js

const express = require("express");
const router = express.Router();
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionsController");
const { verifyToken } = require("../middlewares/authMiddleware");
const Question = require("../models/Question");

// ✅ Hae kaikki kysymykset tietokannasta
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Virhe haettaessa kysymyksiä",
      error: error.message,
    });
  }
});

// Admin CRUD
router.post("/", verifyToken, createQuestion);
router.put("/:id", verifyToken, updateQuestion);
router.delete("/:id", verifyToken, deleteQuestion);

module.exports = router;
