const Question = require("../models/Question");
const mongoose = require("mongoose");

exports.createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, difficulty } = req.body;

    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ success: false, message: "Kaikki kentät ovat pakollisia" });
    }

    const newQuestion = new Question({ questionText, options, correctAnswer, difficulty });
    await newQuestion.save();

    await req.logEvent("info", "questions.create", "Kysymys lisätty", { id: newQuestion._id, questionText });

    res.status(201).json({ success: true, data: newQuestion });
  } catch (err) {
    await req.logEvent("error", "questions.create.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Virheellinen kysymyksen ID" });
    }

    const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Kysymystä ei löytynyt" });

    await req.logEvent("info", "questions.update", "Kysymystä päivitetty", { id });

    res.json({ success: true, data: updated });
  } catch (err) {
    await req.logEvent("error", "questions.update.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Kysymystä ei löytynyt" });

    await req.logEvent("info", "questions.delete", "Kysymys poistettu", { id });

    res.json({ success: true, message: "Kysymys poistettu" });
  } catch (err) {
    await req.logEvent("error", "questions.delete.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
