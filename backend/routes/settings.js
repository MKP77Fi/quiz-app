// backend/routes/settings.js
const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

// === Hae asetukset ===
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      // Jos ei vielä asetuksia, luodaan oletusarvot
      const defaultSettings = new Settings({ questionLimit: 10, timeLimit: 300 });
      await defaultSettings.save();
      return res.json(defaultSettings);
    }
    res.json(settings);
  } catch (err) {
    console.error("Virhe asetuksia haettaessa:", err);
    res.status(500).json({ error: "Asetusten haku epäonnistui" });
  }
});

// === Päivitä asetukset ===
router.put("/", async (req, res) => {
  try {
    const { questionLimit, timeLimit } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({ questionLimit, timeLimit });
    } else {
      settings.questionLimit = questionLimit ?? settings.questionLimit;
      settings.timeLimit = timeLimit ?? settings.timeLimit;
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error("Virhe asetuksia tallennettaessa:", err);
    res.status(500).json({ error: "Asetusten tallennus epäonnistui" });
  }
});

module.exports = router;
