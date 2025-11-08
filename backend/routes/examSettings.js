const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getExamSettings,
  updateExamSettings
} = require('../controllers/examSettingsController');

// Julkinen: hae asetukset
router.get('/', getExamSettings);

// Suojattu: päivitä asetukset (vain admin)
router.put('/', authMiddleware, updateExamSettings);

module.exports = router;