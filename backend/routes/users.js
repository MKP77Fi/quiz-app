// backend/routes/users.js
const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Varmistetaan, että verifyToken asettaa req.user
// Lisäksi tarkistetaan admin-rooli tässä reitissä
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Ei oikeuksia" });
  }
  next();
};

router.use(verifyToken, requireAdmin);

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
