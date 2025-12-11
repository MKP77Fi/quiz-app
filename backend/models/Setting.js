// backend/models/Setting.js
const mongoose = require("mongoose");

/**
 * ------------------------------------------------------------------
 * ASETUSTEN TIETOMALLI (SCHEMA)
 * ------------------------------------------------------------------
 * Vastaa määrittelydokumentin lukua 12.2 (Kokoelmat ja kentät - settings).
 *
 * Tämä malli tallentaa sovelluksen globaalit säännöt, kuten tentin keston.
 * Tietokannassa on tarkoitus olla vain yksi tähän malliin perustuva dokumentti.
 */
const SettingSchema = new mongoose.Schema({
  // Tentin kysymysten lukumäärä (Spec: exam.questionLimit)
  questionLimit: {
    type: Number,
    required: true,
    default: 10,
  },

  // Tentin aikaraja sekunteina (Spec: exam.timeLimitSeconds)
  timeLimit: {
    type: Number,
    required: true,
    default: 300, // 5 minuuttia
  },

  // Seuraavat kentät ovat ylläpidon seurantaa varten (Spec sivu 37):
  
  // Kuka muokkasi asetuksia viimeksi (Adminin käyttäjätunnus)
  lastUpdatedBy: {
    type: String,
    default: "System"
  },

  // Milloin asetuksia muokattiin viimeksi
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  // Pakotetaan kokoelman nimeksi "settings" (monikko), kuten määrittelyssä (Luku 12.2)
  collection: "settings" 
});

// Päivitetään aikaleima automaattisesti aina kun asetuksia muokataan
SettingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Jos käytetään findOneAndUpdate, tämä varmistaa aikaleiman päivityksen
SettingSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model("Setting", SettingSchema);