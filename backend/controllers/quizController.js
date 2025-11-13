// backend/controllers/quizController.js
exports.startQuiz = async (req, res) => {
  try {
    const user = req.user?.username || "Anonymous";
    await req.logEvent("info", "quiz.start", "Tentti aloitettu", { user });
    res.json({ success: true, message: "Tentti aloitettu" });
  } catch (err) {
    await req.logEvent("error", "quiz.start.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.finishQuiz = async (req, res) => {
  try {
    const { score, total } = req.body;
    const user = req.user?.username || "Anonymous";
    await req.logEvent("info", "quiz.finish", "Tentti suoritettu", {
      user,
      score,
      total,
    });
    res.json({ success: true, message: "Tentti suoritettu" });
  } catch (err) {
    await req.logEvent("error", "quiz.finish.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.timeoutQuiz = async (req, res) => {
  try {
    const user = req.user?.username || "Anonymous";
    await req.logEvent("warn", "quiz.timeout", "Tenttiaika loppui", { user });
    res.json({ success: true, message: "Tenttiaika päättyi" });
  } catch (err) {
    await req.logEvent("error", "quiz.timeout.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
