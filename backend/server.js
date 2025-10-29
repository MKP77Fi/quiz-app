// backend/server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth"); // oletuksena jo olemassa
const questionRoutes = require("./routes/questions"); // oletetaan olemassa
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Reitit
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);

// MongoDB yhteys
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGODB_URI ei ole määritelty .env-tiedostossa!");
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
