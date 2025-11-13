// backend/routes/logs.js
const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const { verifyAdmin } = require("../middlewares/authMiddleware");

// Kaikki logi-reitit vain admin-käyttäjille
router.get("/", verifyAdmin, logController.getLogs);
router.get("/:id", verifyAdmin, logController.getLogById);
router.post("/", verifyAdmin, logController.createLog);
router.delete("/:id", verifyAdmin, logController.deleteLog);
router.delete("/", verifyAdmin, logController.deleteOldLogs);

module.exports = router;
