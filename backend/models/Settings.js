// backend/models/Settings.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  questionLimit: {
    type: Number,
    required: true,
    default: 10,
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 300, // sekuntia (5 min)
  },
}, { collection: "settings" });

module.exports = mongoose.model("Settings", settingsSchema);
