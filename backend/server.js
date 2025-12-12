// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// --- LISÄYS 1: Tuodaan loggerMiddleware ---
const loggerMiddleware = require('./Middlewares/loggerMiddleware'); 
// -----------------------------------------


// Ladataan ympäristömuuttujat
dotenv.config();

// Alustetaan Express-sovellus
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---

// 1. CORS (Sallii liikenteen Frontendistä)
// Määritellään sallitut osoitteet (Localhost + Tuotanto)
const allowedOrigins = [
  'http://localhost:5173',                  // Vite Localhost
  'http://localhost:3000',                  // Backend itse
  process.env.ALLOWED_ORIGIN                // Tuotanto (Render/Vercel)
];

app.use(cors({
  origin: function (origin, callback) {
    // Sallitaan pyynnöt ilman originia (esim. Postman tai mobiilisovellukset)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('vercel.app')) {
      // Jos haluat olla tiukka, poista tuo vercel.app tarkistus tuotannossa
      return callback(new Error('CORS-politiikka estää tämän pyynnön.'), false);
    }
    return callback(null, true);
  },
  credentials: true // Sallii keksit/sessiot tarvittaessa
}));

// 2. JSON-parseri (TÄRKEÄ: Ilman tätä POST-pyynnöt eivät toimi!)
app.use(express.json());

// --- LISÄYS 2: Otetaan logger käyttöön ---
// Tämän täytyy olla tässä, JSON-parserin jälkeen mutta ENNEN reittejä!
app.use(loggerMiddleware);
// -----------------------------------------

// --- REITIT ---

// Testireitti juureen (Wake-up ping)
app.get('/', (req, res) => {
  res.status(200).send('Backend is running and awake!');
});

// API-reitit
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/users');
const settingRoutes = require('./routes/settings');
const logRoutes = require('./routes/logs');
const quizRoutes = require('./routes/quiz'); // Lisätty aiemmin

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/logs', logRoutes);
// Varmista että quizRoutes on olemassa tai poista tämä rivi jos et tehnyt sitä tiedostoa
// app.use('/api/quiz', quizRoutes); 

// --- TIETOKANTAYHTEYS JA KÄYNNISTYS ---

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Yhteys MongoDB:hen muodostettu');
    app.listen(PORT, () => {
      console.log(`🚀 Palvelin käynnissä portissa ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Tietokantavirhe:', err);
  });