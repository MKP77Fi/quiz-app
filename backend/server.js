require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const questionsRoutes = require('./routes/questions');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (jos frontend on eri portissa)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Yhdistä MongoDB
connectDB();

// Reitit
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);

// Testireitti
app.get('/', (req, res) => {
  res.json({ message: 'TSW Ajolupakoe API toimii!' });
});

// Käynnistä palvelin
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});

module.exports = app;