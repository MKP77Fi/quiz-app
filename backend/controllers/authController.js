const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login - Kirjautuminen
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validoi että käyttäjätunnus ja salasana on annettu
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Käyttäjätunnus ja salasana ovat pakollisia' 
      });
    }

    // Etsi käyttäjä tietokannasta
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Virheellinen käyttäjätunnus tai salasana' 
      });
    }

    // Tarkista että käyttäjä on aktiivinen
    if (!user.active) {
      return res.status(403).json({ 
        error: 'Käyttäjätili on poistettu käytöstä' 
      });
    }

    // Tarkista salasana
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Virheellinen käyttäjätunnus tai salasana' 
      });
    }

    // Luo JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ 
        error: 'Palvelinvirhe: JWT_SECRET puuttuu' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username, 
        role: user.role 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Kirjautuminen onnistui',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Virhe kirjautumisessa', 
      details: error.message 
    });
  }
};

module.exports = {
  login
};