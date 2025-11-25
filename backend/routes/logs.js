// backend/routes/logs.js
const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// LISÄTTY: Tuodaan myös verifyToken (tai vastaava, tarkista nimi authMiddlewaresta jos tämä ei toimi)
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

// Kaikki logi-reitit vain admin-käyttäjille
// MUUTOS: Lisätään verifyToken ensimmäiseksi tarkistajaksi kaikkiin riveihin

router.get("/", verifyToken, verifyAdmin, logController.getLogs);
router.get("/:id", verifyToken, verifyAdmin, logController.getLogById);
router.post("/", verifyToken, verifyAdmin, logController.createLog);
router.delete("/:id", verifyToken, verifyAdmin, logController.deleteLog);
router.delete("/", verifyToken, verifyAdmin, logController.deleteOldLogs);

module.exports = router;