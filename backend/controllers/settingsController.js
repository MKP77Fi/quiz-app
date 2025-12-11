// backend/controllers/settingsController.js

const Setting = require("../models/Setting");

/**
 * ------------------------------------------------------------------
 * HAE TENTTIASETUKSET (GET SETTINGS)
 * ------------------------------------------------------------------
 * Hakee voimassa olevat säännöt tentille.
 * Jos asetuksia ei ole vielä luotu tietokantaan, palauttaa
 * turvalliset oletusarvot (10 kysymystä, 5 minuutin aikaraja).
 */
exports.getSettings = async (req, res) => {
  try {
    // Haetaan asetukset. Koska asetuksia on vain yhdet, hakuehtoja ei tarvita.
    const settings = await Setting.findOne();

    // Palautetaan joko löydetyt asetukset tai koodiin kovakoodatut oletukset
    res.json(settings || { questionLimit: 10, timeLimit: 300 });
  } catch (err) {
    // Lokitetaan tekninen virhe, palautetaan yleinen virheviesti
    await req.logEvent("error", "settings.get.error", err.message);
    res.status(500).json({ success: false, message: "Virhe asetusten haussa" });
  }
};

/**
 * ------------------------------------------------------------------
 * PÄIVITÄ TENTTIASETUKSET (UPDATE SETTINGS)
 * ------------------------------------------------------------------
 * Admin-toiminto, jolla muutetaan tentin kestoa tai kysymysmäärää.
 * Sovellus ylläpitää vain yhtä asetusdokumenttia (Singleton-malli).
 */
exports.updateSettings = async (req, res) => {
  try {
    const { questionLimit, timeLimit } = req.body;

    // 1. Validointi (Määrittely 12.3)
    // Varmistetaan, että arvot ovat järkeviä numeroita
    if (
      !questionLimit || typeof questionLimit !== 'number' || questionLimit < 1 ||
      !timeLimit || typeof timeLimit !== 'number' || timeLimit < 10
    ) {
      return res.status(400).json({ 
        success: false, 
        message: "Virheelliset arvot: Kysymysmäärän tulee olla > 0 ja ajan > 10s." 
      });
    }

    // 2. Päivitys tietokantaan
    // findOneAndUpdate({}, ...) ilman filtteriä kohdistuu kokoelman ensimmäiseen dokumenttiin.
    // upsert: true luo dokumentin, jos sellaista ei vielä ole.
    const updated = await Setting.findOneAndUpdate(
      {}, 
      { questionLimit, timeLimit },
      { new: true, upsert: true } // new: true palauttaa muokatun version
    );

    // 3. Lokitetaan muutos (Määrittely 10.8)
    // Tärkeää turvallisuuden kannalta nähdä, kuka muutti sääntöjä ja milloin.
    await req.logEvent("info", "settings.update", "Tenttiasetuksia päivitetty", {
      questionLimit,
      timeLimit,
      updatedBy: req.user?.username || "Admin"
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    await req.logEvent("error", "settings.update.error", err.message);
    res.status(500).json({ success: false, message: "Virhe asetusten päivityksessä" });
  }
};