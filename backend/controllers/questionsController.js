const Question = require("../models/Question");
const mongoose = require("mongoose");

// Luo uusi kysymys
exports.createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, difficulty } = req.body;

    // Validointi
    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ success: false, message: "Kaikki kentät ovat pakollisia" });
    }
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, message: "Vaihtoehtoja oltava vähintään kaksi" });
    }
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ success: false, message: "Oikean vastauksen täytyy löytyä vaihtoehdoista" });
    }

    const newQuestion = new Question({ questionText, options, correctAnswer, difficulty });
    await newQuestion.save();
    res.status(201).json({ success: true, data: newQuestion });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Päivitä kysymys
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Virheellinen kysymyksen ID" });
    }

    const { questionText, options, correctAnswer, difficulty } = req.body;
    if (options && (!Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({ success: false, message: "Vaihtoehtoja oltava vähintään kaksi" });
    }
    if (correctAnswer && options && !options.includes(correctAnswer)) {
      return res.status(400).json({ success: false, message: "Oikean vastauksen täytyy löytyä vaihtoehdoista" });
    }

    const updated = await Question.findByIdAndUpdate(id, { questionText, options, correctAnswer, difficulty }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Kysymystä ei löytynyt" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Poista kysymys
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Virheellinen kysymyksen ID" });
    }

    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Kysymystä ei löytynyt" });
    }
    res.json({ success: true, message: "Kysymys poistettu" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
