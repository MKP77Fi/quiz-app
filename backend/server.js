// === Ladataan tarvittavat kirjastot ===
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") }); // Lataa .env tiedoston varmuudella
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// === Reitit ===
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");

// === Sovelluksen asetukset ===
const app = express();
const PORT = process.env.PORT || 3000;

// === Middlewaret ===
app.use(bodyParser.json());
app.use(cors());

// === MongoDB-yhteyden muodostus ===
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MongoDB URI is not defined! Tarkista .env-tiedosto.");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// === Perusreitit ===
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);

// Testireitti
app.get("/", (req, res) => {
  res.send("Serveri toimii! 🚀");
});

// === Käynnistetään palvelin ===
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
