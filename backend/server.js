// backend/server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Reitit
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const userRoutes = require("./routes/users");
const settingsRoutes = require("./routes/settings");
const logRoutes = require("./routes/logs"); // ✅ uusi
const loggerMiddleware = require("./middlewares/loggerMiddleware"); // ✅ uusi

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(loggerMiddleware); // ✅ Lisää loggaus kaikille requesteille

// Reittien käyttöönotto
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/logs", logRoutes); // ✅ uusi logireitti

// MongoDB yhteys
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGODB_URI ei ole määritelty .env-tiedostossa!");
  process.exit(1);
}

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);


mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
