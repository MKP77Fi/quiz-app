const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kovakoodatut käyttäjät (yksinkertaisuuden vuoksi)
// Tulevaisuudessa nämä voidaan siirtää tietokantaan
const users = [
  {
    username: 'admin',
    password: '$2a$10$u2kpzQkBZpDwe28PF9qiT.tNAjH2rNG8hT223aAUeR6xerF7HME4C', 
    role: 'admin'
  },
  {
    username: 'harjoittelija',
    password: '$2a$10$aQKiKlqhQBSAW4CJmBlWB.joBiV3X4558rKM7.PnU8kbVFptHgZ/a', 
    role: 'trainee'
  }
];

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

    // Etsi käyttäjä
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Virheellinen käyttäjätunnus tai salasana' 
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
