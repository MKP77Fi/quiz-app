const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Hae token Authorization-headerista
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Autentikointi epäonnistui: Token puuttuu' 
      });
    }

    // Erottele token "Bearer <token>" -muodosta
    const token = authHeader.split(' ')[1];

    // Varmista JWT_SECRET ympäristömuuttuja
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ 
        error: 'Palvelinvirhe: JWT_SECRET ei ole määritelty' 
      });
    }

    // Tarkista ja dekoodaa token
    const decoded = jwt.verify(token, jwtSecret);

    // Tarkista, että käyttäjä on admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Käyttöoikeus evätty: Vain admin voi suorittaa tämän toiminnon' 
      });
    }

    // Liitä käyttäjätiedot requestiin myöhempää käyttöä varten
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Autentikointi epäonnistui: Virheellinen token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Autentikointi epäonnistui: Token on vanhentunut' 
      });
    }
    return res.status(500).json({ 
      error: 'Palvelinvirhe autentikoinnissa' 
    });
  }
};

module.exports = authMiddleware;
