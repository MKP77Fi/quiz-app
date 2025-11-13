// backend/models/Log.js
const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  level: { type: String, required: true, enum: ["debug","info","warn","error","audit"] },
  service: { type: String, default: "backend" },
  event: { type: String, required: true },
  message: { type: String, default: "" },
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    username: { type: String, required: false },
    role: { type: String, required: false },
  },
  ip: { type: String },
  route: { type: String },
  method: { type: String },
  payload: { type: mongoose.Schema.Types.Mixed }, // varattu ei-sensitiiviselle
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

// TTL-index: poistaa dokumentit LOG_TTL_DAYS jälkeen (konfiguroitava)
const ttlDays = parseInt(process.env.LOG_TTL_DAYS || "90", 10);
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * ttlDays });

module.exports = mongoose.model("Log", LogSchema);
