// backend/controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Hae kaikki käyttäjät (ilman salausta)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Luo uusi käyttäjä
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username ja password ovat pakollisia" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ success: false, message: "Käyttäjätunnus on jo käytössä" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, passwordHash, role: role || "user" });
    await newUser.save();

    // Palauta käyttäjä ilman passwordHash
    const result = newUser.toObject();
    delete result.passwordHash;

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Päivitä käyttäjä (voidaan päivittää salasana)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const update = {};
    if (username) update.username = username;
    if (role) update.role = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.passwordHash = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select("-passwordHash");
    if (!updated) return res.status(404).json({ success: false, message: "Käyttäjää ei löytynyt" });

    res.json({ success: true, data: updated });
  } catch (err) {
    // Käsittele esim. unique-virheet
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Käyttäjätunnus on jo käytössä" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Poista käyttäjä
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Käyttäjää ei löytynyt" });

    res.json({ success: true, message: "Käyttäjä poistettu" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
