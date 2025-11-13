const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).lean();
    res.json(users);
  } catch (err) {
    await req.logEvent("error", "users.get.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({ username, passwordHash, role: role || "user" });
    await newUser.save();

    await req.logEvent("info", "users.create", "Uusi käyttäjä lisätty", { username, role });

    const result = newUser.toObject();
    delete result.passwordHash;
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    await req.logEvent("error", "users.create.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = {};

    if (req.body.username) update.username = req.body.username;
    if (req.body.role) update.role = req.body.role;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      update.passwordHash = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select("-passwordHash");
    if (!updated) return res.status(404).json({ success: false, message: "Käyttäjää ei löytynyt" });

    await req.logEvent("info", "users.update", "Käyttäjää päivitetty", { id });

    res.json({ success: true, data: updated });
  } catch (err) {
    await req.logEvent("error", "users.update.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Käyttäjää ei löytynyt" });

    await req.logEvent("info", "users.delete", "Käyttäjä poistettu", { id, username: deleted.username });

    res.json({ success: true, message: "Käyttäjä poistettu" });
  } catch (err) {
    await req.logEvent("error", "users.delete.error", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
