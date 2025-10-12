const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionsController');

// Julkiset reitit (harjoittelijalle)
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);

// Suojatut reitit (vain adminille)
router.post('/', authMiddleware, createQuestion);
router.put('/:id', authMiddleware, updateQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);

module.exports = router;
