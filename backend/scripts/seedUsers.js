require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Yhdistä tietokantaan
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB yhdistetty onnistuneesti');

    // Poista vanhat käyttäjät (valinnainen)
    await User.deleteMany({});
    console.log('Vanhat käyttäjät poistettu');

    // Luo hashit salasanoille
    const adminPassword = await bcrypt.hash('admin123', 10);
    const traineePassword = await bcrypt.hash('harjoittelija123', 10);

    // Luo käyttäjät
    const users = [
      {
        username: 'admin',
        password: adminPassword,
        role: 'admin',
        active: true
      },
      {
        username: 'harjoittelija',
        password: traineePassword,
        role: 'trainee',
        active: true
      }
    ];

    await User.insertMany(users);
    console.log('Käyttäjät luotu onnistuneesti:');
    console.log('- admin / admin123 (role: admin)');
    console.log('- harjoittelija / harjoittelija123 (role: trainee)');

    process.exit(0);
  } catch (error) {
    console.error('Virhe käyttäjien luomisessa:', error);
    process.exit(1);
  }
};

seedUsers();