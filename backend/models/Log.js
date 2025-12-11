// backend/models/Log.js
const mongoose = require("mongoose");

/**
 * ------------------------------------------------------------------
 * LOKITIETOJEN TIETOMALLI (LOG SCHEMA)
 * ------------------------------------------------------------------
 * Vastaa määrittelydokumentin lukua 12.2 (logs).
 *
 * Tämä malli määrittelee, mitä tietoja järjestelmän "mustaan laatikkoon"
 * tallennetaan. Lokitietoja käytetään virheiden selvitykseen ja
 * tietoturvan valvontaan (audit trail).
 */
const LogSchema = new mongoose.Schema({
  // Lokin vakavuusaste.
  // "audit" on lisätty määrittelyn ulkopuolelta tietoturvatapahtumille.
  level: { 
    type: String, 
    required: true, 
    enum: ["debug", "info", "warn", "error", "audit"] 
  },

  // Mikä palvelu tuotti lokin (hyödyllinen, jos järjestelmä laajenee mikropalveluiksi)
  service: { type: String, default: "backend" },

  // Tapahtuman tekninen tunniste (esim. "auth.login.success")
  event: { type: String, required: true },

  // Selkokielinen viesti ylläpitäjälle
  message: { type: String, default: "" },

  // Käyttäjätiedot (Parempi toteutus kuin pelkkä String: tallennetaan myös rooli)
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    username: { type: String, required: false }, // Tallennetaan snapshot nimestä siltä varalta, että käyttäjä poistetaan
    role: { type: String, required: false },
  },

  // Tekniset jäljitystiedot
  ip: { type: String },       // Mistä IP-osoitteesta pyyntö tuli
  route: { type: String },    // Mikä API-osoite (esim. /api/login)
  method: { type: String },   // HTTP-metodi (POST, GET...)

  // Muuttuva data (TÄRKEÄÄ: Ei saa sisältää henkilötietoja/GDPR)
  payload: { type: mongoose.Schema.Types.Mixed }, 
  
  // Metadata (esim. suoritusaika ms)
  meta: { type: mongoose.Schema.Types.Mixed },

  // Aikaleima (luodaan automaattisesti)
  createdAt: { type: Date, default: Date.now }
});

/**
 * ------------------------------------------------------------------
 * AUTOMAATTINEN POISTO (TTL INDEX)
 * ------------------------------------------------------------------
 * Vastaa määrittelyä 12.4.
 *
 * MongoDB huolehtii vanhojen lokien poistamisesta automaattisesti taustalla.
 * Oletuksena lokit säilyvät 90 päivää (voidaan muuttaa ympäristömuuttujalla).
 */
const ttlDays = parseInt(process.env.LOG_TTL_DAYS || "90", 10);

// expireAfterSeconds kertoo, kuinka kauan 'createdAt'-hetkestä dokumentti säilyy.
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * ttlDays });

module.exports = mongoose.model("Log", LogSchema);