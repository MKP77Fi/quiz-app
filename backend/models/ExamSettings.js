const mongoose = require('mongoose');

const examSettingsSchema = new mongoose.Schema({
  questionCount: {
    type: Number,
    default: 10,
    min: [1, 'Vähintään 1 kysymys'],
    max: [100, 'Enintään 100 kysymystä']
  },
  timeLimit: {
    type: Number,
    default: 20,
    min: [1, 'Vähintään 1 minuutti'],
    max: [180, 'Enintään 180 minuuttia']
  }
}, {
  timestamps: true
});

const ExamSettings = mongoose.model('ExamSettings', examSettingsSchema, 'examsettings');

module.exports = ExamSettings;