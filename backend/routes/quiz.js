// backend/routes/quiz.js
const express = require('express');
const router = express.Router();

// ✅ KORJAUS: Puretaan objekti aaltosulkeilla ja haetaan "verifyToken"-niminen funktio
const { verifyToken } = require('../middlewares/authMiddleware');

// Jos Log-mallia ei ole vielä olemassa, tämä voi aiheuttaa virheen.
// Varmistetaan, että se haetaan oikein, tai kommentoidaan pois jos malli puuttuu.
let Log;
try {
  Log = require('../models/Log');
} catch (e) {
  console.warn("Log model not found, audit logging will be disabled for quiz.");
}

/**
 * POST /api/quiz/start
 * Kirjaa lokiin, että käyttäjä aloitti tentin.
 */
router.post('/start', verifyToken, async (req, res) => {
  try {
    if (Log) {
      const log = new Log({
        username: req.user.username,
        action: 'QUIZ_START',
        details: 'Käyttäjä aloitti tentin',
        ip: req.ip || req.connection.remoteAddress
      });
      await log.save();
    }
    res.status(200).json({ message: 'Aloitus kirjattu' });
  } catch (err) {
    console.error("Virhe tentin aloituksen kirjauksessa:", err);
    // Emme halua estää tentin tekoa, vaikka lokitus epäonnistuisi
    res.status(200).send(); 
  }
});

/**
 * POST /api/quiz/finish
 * Kirjaa lokiin tentin tuloksen (normaali lopetus).
 */
router.post('/finish', verifyToken, async (req, res) => {
  const { score, total } = req.body;

  try {
    if (Log) {
      const log = new Log({
        username: req.user.username,
        action: 'QUIZ_FINISH',
        details: `Tentti suoritettu. Tulos: ${score}/${total}`,
        ip: req.ip || req.connection.remoteAddress
      });
      await log.save();
    }
    res.status(200).json({ message: 'Tulos tallennettu' });
  } catch (err) {
    console.error("Virhe tuloksen tallennuksessa:", err);
    res.status(500).json({ message: 'Virhe tallennuksessa' });
  }
});

/**
 * POST /api/quiz/timeout
 * Kirjaa lokiin, jos aika loppui kesken.
 */
router.post('/timeout', verifyToken, async (req, res) => {
  const { score, total } = req.body;

  try {
    if (Log) {
      const log = new Log({
        username: req.user.username,
        action: 'QUIZ_TIMEOUT',
        details: `Aika loppui kesken. Tulos: ${score}/${total}`,
        ip: req.ip || req.connection.remoteAddress
      });
      await log.save();
    }
    res.status(200).json({ message: 'Aikakatkaisu tallennettu' });
  } catch (err) {
    console.error("Virhe aikakatkaisun tallennuksessa:", err);
    res.status(500).json({ message: 'Virhe tallennuksessa' });
  }
});

module.exports = router;