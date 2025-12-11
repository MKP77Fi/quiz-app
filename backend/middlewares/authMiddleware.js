// backend/middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");

// Käytetään samaa salaista avainta kuin kirjautumisessa (authController)
const SECRET_KEY = process.env.JWT_SECRET || "salainen_avain";

/**
 * ------------------------------------------------------------------
 * TOKENIN TARKISTUS (VERIFY TOKEN)
 * ------------------------------------------------------------------
 * Tämä middleware toimii "ovimiehenä". Se tarkistaa, onko käyttäjän
 * lähettämässä pyynnössä mukana voimassa oleva digitaalinen avain (JWT).
 * * Toimintaperiaate:
 * 1. Etsii Authorization-otsikon (Header).
 * 2. Erottaa sieltä tokenin (muodossa "Bearer <token>").
 * 3. Varmistaa tokenin aitouden salaisella avaimella.
 * 4. Jos ok, päästää käyttäjän eteenpäin (next()).
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  // Token on yleensä muodossa "Bearer eyJhbGci...", joten pilkotaan se välilyönnistä
  const token = authHeader && authHeader.split(" ")[1];

  // Jos token puuttuu kokonaan, pääsy evätään heti
  if (!token) {
    // Emme lokita tätä aina "warn"-tasolla, koska se voi täyttää lokit turhaan (esim. bottien skannaukset),
    // mutta sovelluksen debuggaukseen tieto on hyvä olla.
    return res.status(403).json({ success: false, message: "Pääsy evätty: Tunniste puuttuu" });
  }

  try {
    // Tarkistetaan onko token aito ja voimassa (ei vanhentunut)
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Jos tarkistus onnistuu, tallennetaan käyttäjän tiedot (id, rooli) pyyntöön,
    // jotta seuraavat funktiot tietävät, kuka käyttäjä on.
    req.user = decoded; 
    
    next(); // Siirrytään seuraavaan vaiheeseen
  } catch (err) {
    // Jos token on väärennetty tai vanhentunut
    if (req.logEvent) {
      await req.logEvent("warn", "auth.verify.fail", "Virheellinen token", { error: err.message, ip: req.ip });
    }
    return res.status(401).json({ success: false, message: "Istunto on vanhentunut tai virheellinen" });
  }
};

/**
 * ------------------------------------------------------------------
 * ADMIN-OIKEUKSIEN TARKISTUS (VERIFY ADMIN)
 * ------------------------------------------------------------------
 * Tämä middleware varmistaa, että käyttäjällä on "admin"-rooli.
 * Tätä käytetään suojaamaan hallintatoimintoja (esim. kysymysten poisto).
 * * HUOM: Tätä tulee käyttää AINA yhdessä verifyToken-middlewaren kanssa.
 */
const verifyAdmin = async (req, res, next) => {
  // Tarkistetaan, onko käyttäjätieto olemassa ja onko rooli oikea
  if (!req.user || req.user.role !== "admin") {
    
    // Lokitetaan luvaton yritys päästä admin-alueelle (tärkeä tietoturvatie)
    if (req.logEvent) {
      await req.logEvent("warn", "auth.admin.denied", "Luvaton pääsy admin-toimintoon", { 
        user: req.user?.username || "Unknown",
        role: req.user?.role 
      });
    }

    return res.status(403).json({ success: false, message: "Ei käyttöoikeutta tähän toimintoon" });
  }
  
  next(); // Käyttäjä on admin, matka jatkuu
};

module.exports = { verifyToken, verifyAdmin };