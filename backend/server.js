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
const logRoutes = require("./routes/logs"); 
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const errorHandler = require("./middlewares/errorHandler");

// UUSI: Tuodaan keepAlive-funktio
const startKeepAlive = require("./utils/keepAlive");

const app = express();

// =========================
//  CORS ASETUKSET
// =========================

const allowedOrigins = [
    "http://localhost:5173",                      // Kehitys
    "https://quiz-app-six-pi-21.vercel.app",      // Vercel production
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Sallitaan Postman / ei-origin pyynnöt (kuten Renderin terveyscheckit ja keep-alive skripti)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.warn("⛔ Estetty CORS-pyyntö:", origin);
            return callback(new Error("CORS estetty: " + origin), false);
        },
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// =========================
//  MIDDLEWARET
// =========================
app.use(bodyParser.json());
app.use(loggerMiddleware);

// =========================
//  UUSI: JUURIREITTI (HERÄTYS)
// =========================
// Tämä vastaa frontendin ja keep-alive skriptin pingaukseen.
app.get("/", (req, res) => {
    res.status(200).send("TSW Backend is running and awake!");
});

// =========================
//  API-REITIT
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/logs", logRoutes);

// =========================
//  ERROR HANDLER (AINA LOPPUUN)
// =========================
app.use(errorHandler);

// =========================
//  MONGODB-YHTEYS JA KÄYNNISTYS
// =========================
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGODB_URI puuttuu .env-tiedostosta!");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");

        const PORT = process.env.PORT; // EI fallback 3000
        if (!PORT) throw new Error("PORT environment variable is not set!");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);

            // UUSI: Käynnistetään Keep-Alive (vain tuotannossa)
            // RENDER_EXTERNAL_URL on Renderin automaattisesti tarjoama (tai itse asetettu) muuttuja
            if (process.env.NODE_ENV === 'production' || process.env.RENDER_EXTERNAL_URL) {
                const myUrl = process.env.RENDER_EXTERNAL_URL || 'https://ajolupa-backend.onrender.com';
                startKeepAlive(myUrl);
            }
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });