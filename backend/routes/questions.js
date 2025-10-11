const express = require("express");
const router = express.Router();
const { createQuestion, updateQuestion, deleteQuestion } = require("../controllers/questionsController");
const { verifyToken } = require("../middlewares/authMiddleware");

// GET: aiemmin luotu testidata / kaikki kysymykset → jätä se myös tähän
router.get("/", (req, res) => {
  res.json([{ text: "Demo question", options: ["A", "B"], correct: "A" }]);
});

// Admin CRUD
router.post("/", verifyToken, createQuestion);
router.put("/:id", verifyToken, updateQuestion);
router.delete("/:id", verifyToken, deleteQuestion);

module.exports = router;

