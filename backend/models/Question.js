// backend/models/Question.js

const mongoose = require("mongoose");

/**
 * ------------------------------------------------------------------
 * KYSYMYKSEN TIETOMALLI (QUESTION SCHEMA)
 * ------------------------------------------------------------------
 * Vastaa määrittelydokumentin lukua 12.2 (questions), sovellettuna
 * nykyiseen toteutukseen.
 *
 * Tämä malli määrittelee yksittäisen monivalintakysymyksen rakenteen.
 */
const questionSchema = new mongoose.Schema({
  // Kysymysteksti (pakollinen)
  questionText: { 
    type: String, 
    required: true 
  },

  // Vastausvaihtoehdot (Lista merkkijonoja)
  // Määrittely (12.3) suosittelee rajaamaan määrän järkeväksi (2-6).
  options: { 
    type: [String], 
    required: true, 
    validate: {
      validator: function(v) {
        return v && v.length >= 2 && v.length <= 6;
      },
      message: "Vastausvaihtoehtoja tulee olla 2–6 kappaletta."
    }
  },

  // Oikea vastaus (Merkkijonona, pitää vastata yhtä options-listan arvoa)
  correctAnswer: { 
    type: String, 
    required: true 
  },

  // Vaikeustaso (Tulevaisuuden laajennuksia varten, esim. vaikea tentti)
  difficulty: { 
    type: String, 
    enum: ["easy", "medium", "hard"], 
    default: "easy" 
  },

  // Pistemäärä (Oletus: 1). Mahdollistaa painotetut kysymykset.
  points: {
    type: Number,
    default: 1
  },

  // Onko kysymys julkaistu? (true = näkyy tentissä, false = luonnos/piilotettu)
  published: {
    type: Boolean,
    default: true
  }
}, { 
  // Lisää automaattisesti createdAt ja updatedAt -aikaleimat
  timestamps: true 
});

module.exports = mongoose.model("Question", questionSchema);