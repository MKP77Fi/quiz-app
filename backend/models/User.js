// backend/models/User.js

const mongoose = require("mongoose");

/**
 * ------------------------------------------------------------------
 * KÄYTTÄJÄN TIETOMALLI (USER SCHEMA)
 * ------------------------------------------------------------------
 * Vastaa määrittelydokumentin lukuja 4.1 ja 12.2.
 *
 * Tämä malli määrittelee käyttäjätunnusten rakenteen tietokannassa.
 * Tietoturvasyistä emme tallenna selkokielisiä salasanoja, emmekä
 * kerää henkilötietoja (kuten sähköpostia tai nimeä).
 */
const userSchema = new mongoose.Schema({
  // Käyttäjätunnus (esim. "Kurssi_Kevat_2024")
  // unique: true estää kahden samanlaisen tunnuksen luomisen.
  username: {
    type: String,
    required: true,
    unique: true
  },

  // Salattu salasana (Hash)
  // Tänne tallennetaan vain bcrypt-algoritmilla sotkettu merkkijono.
  // Alkuperäistä salasanaa ei voi lukea tästä kentästä.
  passwordHash: {
    type: String,
    required: true
  },

  // Käyttäjän rooli
  // "admin": Oikeus luoda kysymyksiä ja hallita muita käyttäjiä.
  // "user": Oikeus vain harjoitella ja tehdä tentti.
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
}, {
  // Lisää automaattisesti aikaleimat:
  // createdAt: Milloin tunnus luotiin
  // updatedAt: Milloin tietoja viimeksi muutettiin
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);