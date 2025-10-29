// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "salainen_avain";

/**
 * LOGIN – Tarkistaa käyttäjän tunnukset ja palauttaa JWT-tokenin
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tarkistus 1: Onko kaikki tiedot annettu?
    if (!username || !password) {
      console.warn("⚠️ Kirjautumisyritys puutteellisilla tiedoilla:", { username, password });
      return res.status(400).json({ success: false, message: "Käyttäjätunnus ja salasana vaaditaan" });
    }

    // Tarkistus 2: Etsitään käyttäjä tietokannasta
    const user = await User.findOne({ username }).select("+passwordHash"); // haetaan myös hash
    console.log("🔎 Kirjautumisyritys:", username);
    console.log("🔍 Löydetty käyttäjä:", user ? user.username : "Ei löytynyt");

    if (!user) {
      console.warn("❌ Käyttäjää ei löytynyt tietokannasta:", username);
      return res.status(401).json({ success: false, message: "Virheellinen käyttäjätunnus tai salasana" });
    }

    // Tarkistus 3: Onko käyttäjällä salasana tietokannassa
    if (!user.passwordHash) {
      console.error("❗ Käyttäjältä puuttuu salasana tietokannasta:", username);
      return res.status(500).json({ success: false, message: "Salasanatieto puuttuu tietokannasta" });
    }

    // Tarkistus 4: Verrataan annettua salasanaa ja tallennettua hashia
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      console.warn("🚫 Virheellinen salasana käyttäjälle:", username);
      return res.status(401).json({ success: false, message: "Virheellinen käyttäjätunnus tai salasana" });
    }

    // Jos kaikki ok → luodaan token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("✅ Kirjautuminen onnistui käyttäjälle:", username);
    res.json({
      success: true,
      message: "Kirjautuminen onnistui",
      token,
      role: user.role
    });
  } catch (err) {
    console.error("💥 Kirjautumisvirhe:", err);
    res.status(500).json({ success: false, message: "Palvelinvirhe kirjautumisessa", error: err.message });
  }
};

/**
 * REGISTER – Lisätään uusi käyttäjä (admin käyttää tätä)
 */
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Käyttäjätunnus ja salasana vaaditaan" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Käyttäjätunnus on jo olemassa" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      passwordHash: hashedPassword, // 👈 Tallennetaan oikein
      role: role || "user"
    });

    await newUser.save();

    console.log("👤 Uusi käyttäjä luotu:", username);
    res.status(201).json({ success: true, message: "Käyttäjä luotu onnistuneesti" });
  } catch (err) {
    console.error("💥 Käyttäjän luonnin virhe:", err);
    res.status(500).json({ success: false, message: "Palvelinvirhe käyttäjän luonnissa", error: err.message });
  }
};
