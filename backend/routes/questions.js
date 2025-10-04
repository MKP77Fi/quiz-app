const express = require("express");
const router = express.Router();

// Kovakoodattu testidata (myöhemmin tulee MongoDB:stä)
const testData = [
  { id: 1, text: "Mikä on 2 + 2?", options: ["3", "4", "5"], correct: "4" },
  { id: 2, text: "Mikä on Suomen pääkaupunki?", options: ["Helsinki", "Tampere", "Turku"], correct: "Helsinki" }
];

// GET /api/questions
router.get("/", (req, res) => {
  res.json(testData);
});

module.exports = router;
