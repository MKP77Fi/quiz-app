// controllers/authController.js
const jwt = require("jsonwebtoken");

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "harjoittelija", password: "testi123", role: "user" }
];

const SECRET_KEY = process.env.JWT_SECRET || "salainen_avain";

// Kirjautumisfunktio
exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "Virheellinen käyttäjätunnus tai salasana" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    token,
    role: user.role,
    message: "Kirjautuminen onnistui"
  });
};
