const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      throw new Error('MONGO_URI ei ole määritelty ympäristömuuttujissa');
    }

    await mongoose.connect(MONGO_URI);

    console.log('MongoDB yhdistetty onnistuneesti');
  } catch (error) {
    console.error('MongoDB yhteyden virhe:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;