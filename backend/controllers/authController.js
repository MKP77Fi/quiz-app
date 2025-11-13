// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "salainen_avain";

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      await req.logEvent("warn", "auth.login.fail", "Puutteelliset kirjautumistiedot", { username });
      return res.status(400).json({ success: false, message: "Käyttäjätunnus ja salasana vaaditaan" });
    }

    const user = await User.findOne({ username }).select("+passwordHash");
    if (!user) {
      await req.logEvent("warn", "auth.login.fail", "Tuntematon käyttäjätunnus", { username });
      return res.status(401).json({ success: false, message: "Virheellinen käyttäjätunnus tai salasana" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await req.logEvent("warn", "auth.login.fail", "Virheellinen salasana", { username });
      return res.status(401).json({ success: false, message: "Virheellinen käyttäjätunnus tai salasana" });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    await req.logEvent("info", "auth.login.success", "Kirjautuminen onnistui", { username, role: user.role });

    res.json({ success: true, message: "Kirjautuminen onnistui", token, role: user.role });
  } catch (err) {
    await req.logEvent("error", "auth.login.error", err.message);
    res.status(500).json({ success: false, message: "Palvelinvirhe kirjautumisessa", error: err.message });
  }
};

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
    const newUser = new User({ username, passwordHash: hashedPassword, role: role || "user" });
    await newUser.save();

    await req.logEvent("info", "auth.register", "Uusi käyttäjä luotu", { username, role });

    res.status(201).json({ success: true, message: "Käyttäjä luotu onnistuneesti" });
  } catch (err) {
    await req.logEvent("error", "auth.register.error", err.message);
    res.status(500).json({ success: false, message: "Palvelinvirhe käyttäjän luonnissa", error: err.message });
  }
};
