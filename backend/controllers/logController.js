// backend/controllers/logController.js
const Log = require("../models/Log");

/**
 * Hakee logit suodatettuna (vain admin)
 * Tukee query-parametreja:
 *  ?level=error&event=auth.login&user=admin&from=2025-11-01&to=2025-11-12&limit=50&skip=0
 */
exports.getLogs = async (req, res) => {
  try {
    const {
      level,
      event,
      user,
      from,
      to,
      limit = 50,
      skip = 0,
    } = req.query;

    const filter = {};

    if (level) filter.level = level;
    if (event) filter.event = new RegExp(event, "i");
    if (user)
      filter["user.username"] = new RegExp(user, "i");
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const logs = await Log.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Log.countDocuments(filter);

    res.json({ total, count: logs.length, logs });
  } catch (err) {
    console.error("Virhe logien haussa:", err);
    res.status(500).json({ message: "Logien haku epäonnistui" });
  }
};

/**
 * Hakee yksittäisen lokin ID:n perusteella
 */
exports.getLogById = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Lokia ei löydy" });
    res.json(log);
  } catch (err) {
    console.error("Virhe logia haettaessa:", err);
    res.status(500).json({ message: "Virhe logia haettaessa" });
  }
};

/**
 * Luo uuden lokimerkinnän (valinnainen käyttö, esim. jos frontend haluaa lähettää tapahtumia)
 */
exports.createLog = async (req, res) => {
  try {
    const newLog = new Log({
      level: req.body.level || "info",
      event: req.body.event || "custom.event",
      message: req.body.message || "",
      user: req.body.user || null,
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
      payload: req.body.payload || null,
      meta: req.body.meta || null,
    });

    const saved = await newLog.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Virhe logia luotaessa:", err);
    res.status(500).json({ message: "Logimerkinnän luonti epäonnistui" });
  }
};

/**
 * Poistaa logimerkinnän ID:n perusteella
 */
exports.deleteLog = async (req, res) => {
  try {
    const deleted = await Log.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Lokia ei löytynyt" });
    res.json({ message: "Logi poistettu onnistuneesti" });
  } catch (err) {
    console.error("Virhe logia poistettaessa:", err);
    res.status(500).json({ message: "Logia ei voitu poistaa" });
  }
};

/**
 * Poistaa vanhat logit annetun aikarajan perusteella (esim. olderThan=2025-11-01)
 */
exports.deleteOldLogs = async (req, res) => {
  try {
    const { olderThan } = req.query;
    if (!olderThan)
      return res.status(400).json({ message: "Anna olderThan-parametri (YYYY-MM-DD)" });

    const date = new Date(olderThan);
    const result = await Log.deleteMany({ createdAt: { $lt: date } });
    res.json({ message: `Poistettu ${result.deletedCount} vanhaa logia` });
  } catch (err) {
    console.error("Virhe vanhojen logien poistossa:", err);
    res.status(500).json({ message: "Poisto epäonnistui" });
  }
};
