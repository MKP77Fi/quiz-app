// backend/controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Käytetään bcryptjs-kirjastoa, joka on yhteensopiva aiemman package.json-määrityksen kanssa
const User = require("../models/User");
require("dotenv").config();

// Haetaan salainen avain ympäristömuuttujista. Tämä on "allekirjoitusavain", jolla tokenit varmennetaan.
const SECRET_KEY = process.env.JWT_SECRET || "salainen_avain";

/**
 * ------------------------------------------------------------------
 * KIRJAUTUMINEN (LOGIN)
 * ------------------------------------------------------------------
 * Tarkistaa käyttäjätunnuksen ja salasanan. Jos ne ovat oikein,
 * myöntää käyttäjälle digitaalisen avaimen (JWT-token).
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Tarkistetaan, että kentät eivät ole tyhjiä
    if (!username || !password) {
      await req.logEvent("warn", "auth.login.fail", "Puutteelliset kirjautumistiedot", { username });
      return res.status(400).json({ success: false, message: "Käyttäjätunnus ja salasana vaaditaan" });
    }

    // 2. Etsitään käyttäjä tietokannasta
    // '+passwordHash' tarvitaan, koska salasana on oletuksena piilotettu hauissa turvallisuussyistä
    const user = await User.findOne({ username }).select("+passwordHash");
    
    if (!user) {
      // Tietoturva: Logitetaan tarkka syy palvelimelle, mutta käyttäjälle kerrotaan vain geneerinen virhe
      await req.logEvent("warn", "auth.login.fail", "Tuntematon käyttäjätunnus", { username });
      return res.status(401).json({ success: false, message: "Virheellinen käyttäjätunnus tai salasana" });
    }

    // 3. Verrataan annettua salasanaa tietokannassa olevaan salattuun versioon (hash)
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      await req.logEvent("warn", "auth.login.fail", "Virheellinen salasana", { username });
      return res.status(401).json({ success: false, message: "Virheellinen käyttäjätunnus tai salasana" });
    }

    // 4. Luodaan JWT-token (Digitaalinen kulkulupa)
    // Token sisältää käyttäjänimen ja roolin, ja se on voimassa 1 tunnin.
    const token = jwt.sign(
      { username: user.username, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: "1h" }
    );

    // 5. Kirjataan onnistunut tapahtuma lokiin
    await req.logEvent("info", "auth.login.success", "Kirjautuminen onnistui", { username, role: user.role });

    // Lähetetään token ja rooli frontendille
    res.json({ success: true, message: "Kirjautuminen onnistui", token, role: user.role });

  } catch (err) {
    // Palvelinvirheen sattuessa kirjataan virhe lokiin, mutta ei näytetä teknistä virhettä käyttäjälle
    await req.logEvent("error", "auth.login.error", err.message);
    res.status(500).json({ success: false, message: "Palvelinvirhe kirjautumisessa" });
  }
};

/**
 * ------------------------------------------------------------------
 * REKISTERÖINTI (REGISTER)
 * ------------------------------------------------------------------
 * Luo uuden käyttäjän. Tätä toimintoa kutsuu tyypillisesti Admin
 * hallintapaneelin kautta.
 */
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // 1. Validointi
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Käyttäjätunnus ja salasana vaaditaan" });
    }

    // 2. Tarkistetaan, onko tunnus jo olemassa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Käyttäjätunnus on jo olemassa" });
    }

    // 3. Salataan salasana (Hashaus)
    // Emme koskaan tallenna salasanaa selkokielisenä
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Luodaan uusi käyttäjä tietokantaan
    // Rooli on joko annettu arvo tai oletuksena "user" (harjoittelija)
    const newUser = new User({ 
      username, 
      passwordHash: hashedPassword, 
      role: role || "user" 
    });
    
    await newUser.save();

    // 5. Kirjataan tapahtuma
    await req.logEvent("info", "auth.register", "Uusi käyttäjä luotu", { username, role });

    res.status(201).json({ success: true, message: "Käyttäjä luotu onnistuneesti" });

  } catch (err) {
    await req.logEvent("error", "auth.register.error", err.message);
    res.status(500).json({ success: false, message: "Palvelinvirhe käyttäjän luonnissa" });
  }
};