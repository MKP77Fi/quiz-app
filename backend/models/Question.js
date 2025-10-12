const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Kysymysteksti on pakollinen']
  },
  options: {
    type: [String],
    required: [true, 'Vastausvaihtoehdot ovat pakollisia'],
    validate: {
      validator: function(v) {
        return v && v.length >= 2;
      },
      message: 'Täytyy olla vähintään 2 vastausvaihtoehtoa'
    }
  },
  correctAnswer: {
    type: String,
    required: [true, 'Oikea vastaus on pakollinen']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, {
  timestamps: true // Lisää automaattisesti createdAt ja updatedAt
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;