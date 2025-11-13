// backend/controllers/settingsController.js
const Setting = require("../models/Setting"); // Luo Setting.js -malli jos ei ole
// Setting sisältää kentät: questionLimit, timeLimit

// Hae nykyiset asetukset
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json(settings || { questionLimit: 10, timeLimit: 300 });
  } catch (err) {
    await req.logEvent("error", "settings.get.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Päivitä asetukset (Admin)
exports.updateSettings = async (req, res) => {
  try {
    const { questionLimit, timeLimit } = req.body;
    const updated = await Setting.findOneAndUpdate(
      {},
      { questionLimit, timeLimit },
      { new: true, upsert: true }
    );

    await req.logEvent("info", "settings.update", "Tenttiasetuksia päivitetty", {
      questionLimit,
      timeLimit,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    await req.logEvent("error", "settings.update.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// backend/models/Setting.js
const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  questionLimit: { type: Number, default: 10 },
  timeLimit: { type: Number, default: 300 }, // sekunteina
});

module.exports = mongoose.model("Setting", SettingSchema);
