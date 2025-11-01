const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Käyttäjätunnus on pakollinen'],
    unique: true,
    trim: true,
    minlength: [3, 'Käyttäjätunnuksen täytyy olla vähintään 3 merkkiä']
  },
  password: {
    type: String,
    required: [true, 'Salasana on pakollinen']
  },
  role: {
    type: String,
    enum: ['admin', 'trainee'],
    default: 'trainee',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// TÄRKEÄ: Kolmas parametri määrittää collection-nimen
const User = mongoose.model('User', userSchema, 'accounts');

module.exports = User;