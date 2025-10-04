const jwt = require("jsonwebtoken");
const SECRET_KEY = "salainen_avain";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token puuttuu" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Virheellinen tai vanhentunut token" });
  }
};

module.exports = { verifyToken };
