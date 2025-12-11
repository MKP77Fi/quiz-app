// backend/routes/logs.js

const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// Tuodaan suojaus-middlewaret
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

/**
 * ------------------------------------------------------------------
 * LOG ROUTES (Määrittely 11.4)
 * ------------------------------------------------------------------
 * Base URL: /api/logs
 * * HUOM: Kaikki logi-reitit vaativat ADMIN-oikeudet.
 * Tavallinen käyttäjä ei pääse näkemään järjestelmän sisäisiä tapahtumia.
 */

// GET /api/logs
// Hakee listan logeista (suodatettavissa query-parametreilla)
router.get("/", verifyToken, verifyAdmin, logController.getLogs);

/**
 * ------------------------------------------------------------------
 * POIS KÄYTÖSTÄ (Synkronointi Controllerin kanssa)
 * ------------------------------------------------------------------
 * Seuraavat reitit on poistettu käytöstä, koska vastaavat toiminnot
 * kommentoitiin pois logController.js-tiedostosta tietoturvasyistä
 * (Audit-lokin eheys: logeja ei saa poistaa manuaalisesti).
 */

// router.get("/:id", verifyToken, verifyAdmin, logController.getLogById);
// router.post("/", verifyToken, verifyAdmin, logController.createLog);
// router.delete("/:id", verifyToken, verifyAdmin, logController.deleteLog);
// router.delete("/", verifyToken, verifyAdmin, logController.deleteOldLogs);

module.exports = router;