// backend/scripts/createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

(async () => {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const username = "admin";
  const password = "admin123";
  const role = "admin";

  const existing = await User.findOne({ username });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const u = new User({ username, passwordHash, role });
  await u.save();
  console.log("Admin created");
  process.exit(0);
})();
