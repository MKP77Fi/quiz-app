const Question = require('../models/Question');

// GET - Hae kaikki kysymykset (harjoittelijalle)
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe kysymysten haussa', 
      details: error.message 
    });
  }
};

// GET - Hae yksittäinen kysymys ID:n perusteella
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ 
        error: 'Kysymystä ei löytynyt' 
      });
    }
    
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe kysymyksen haussa', 
      details: error.message 
    });
  }
};

// POST - Luo uusi kysymys (vain admin)
const createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, difficulty } = req.body;

    // Validoi, että kaikki pakolliset kentät on annettu
    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ 
        error: 'Puuttuvia kenttiä: questionText, options ja correctAnswer ovat pakollisia' 
      });
    }

    // Validoi, että options on taulukko ja sisältää vähintään 2 vaihtoehtoa
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        error: 'options täytyy olla taulukko, jossa vähintään 2 vaihtoehtoa' 
      });
    }

    // Validoi, että correctAnswer löytyy options-taulukosta
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ 
        error: 'correctAnswer täytyy olla yksi options-taulukon vaihtoehdoista' 
      });
    }

    // Luo uusi kysymys
    const newQuestion = new Question({
      questionText,
      options,
      correctAnswer,
      difficulty: difficulty || 'medium'
    });

    const savedQuestion = await newQuestion.save();
    
    res.status(201).json({ 
      message: 'Kysymys luotu onnistuneesti', 
      question: savedQuestion 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe kysymyksen luomisessa', 
      details: error.message 
    });
  }
};

// PUT - Päivitä kysymys (vain admin)
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, options, correctAnswer, difficulty } = req.body;

    // Tarkista, että kysymys löytyy
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ 
        error: 'Kysymystä ei löytynyt' 
      });
    }

    // Validoi options ja correctAnswer, jos ne päivitetään
    if (options) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ 
          error: 'options täytyy olla taulukko, jossa vähintään 2 vaihtoehtoa' 
        });
      }
    }

    // Jos correctAnswer päivitetään, varmista että se löytyy options-taulukosta
    const updatedOptions = options || existingQuestion.options;
    const updatedCorrectAnswer = correctAnswer || existingQuestion.correctAnswer;
    
    if (!updatedOptions.includes(updatedCorrectAnswer)) {
      return res.status(400).json({ 
        error: 'correctAnswer täytyy olla yksi options-taulukon vaihtoehdoista' 
      });
    }

    // Päivitä kysymys
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { questionText, options, correctAnswer, difficulty },
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      message: 'Kysymys päivitetty onnistuneesti', 
      question: updatedQuestion 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe kysymyksen päivityksessä', 
      details: error.message 
    });
  }
};

// DELETE - Poista kysymys (vain admin)
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ 
        error: 'Kysymystä ei löytynyt' 
      });
    }

    res.status(200).json({ 
      message: 'Kysymys poistettu onnistuneesti', 
      question: deletedQuestion 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe kysymyksen poistamisessa', 
      details: error.message 
    });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};