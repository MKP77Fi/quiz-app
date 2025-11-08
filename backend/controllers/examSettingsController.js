const ExamSettings = require('../models/ExamSettings');

// GET - Hae tenttiasetukset
const getExamSettings = async (req, res) => {
  try {
    let settings = await ExamSettings.findOne();
    
    // Jos asetuksia ei ole, luo oletusasetukset
    if (!settings) {
      settings = new ExamSettings({
        questionCount: 10,
        timeLimit: 20
      });
      await settings.save();
    }
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe asetusten haussa', 
      details: error.message 
    });
  }
};

// PUT - Päivitä tenttiasetukset (vain admin)
const updateExamSettings = async (req, res) => {
  try {
    const { questionCount, timeLimit } = req.body;

    let settings = await ExamSettings.findOne();
    
    if (!settings) {
      settings = new ExamSettings();
    }

    if (questionCount !== undefined) {
      settings.questionCount = questionCount;
    }
    
    if (timeLimit !== undefined) {
      settings.timeLimit = timeLimit;
    }

    await settings.save();

    res.status(200).json({ 
      message: 'Asetukset päivitetty onnistuneesti', 
      settings 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe asetusten päivityksessä', 
      details: error.message 
    });
  }
};

module.exports = {
  getExamSettings,
  updateExamSettings
};