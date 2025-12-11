// backend/scripts/createAdmin.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Käytetään bcryptjs yhteensopivuuden vuoksi
const User = require("../models/User");

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

/**
 * ------------------------------------------------------------------
 * ALUSTUSSKRIPTI: ADMIN-KÄYTTÄJÄN LUONTI
 * ------------------------------------------------------------------
 * Tätä skriptiä ajetaan yleensä vain kerran sovelluksen pystytyksen yhteydessä.
 * Se varmistaa, että tietokannassa on vähintään yksi Admin-tunnus,
 * jolla pääsee kirjautumaan sisään ja luomaan muita käyttäjiä.
 */
(async () => {
  try {
    // Tarkistetaan tietokantaosoite
    if (!MONGO_URI) {
      console.error("❌ Virhe: MONGODB_URI puuttuu .env-tiedostosta.");
      process.exit(1);
    }

    // Yhdistetään tietokantaan
    await mongoose.connect(MONGO_URI);
    console.log("✅ Yhteys tietokantaan muodostettu.");

    // Määritetään tunnukset
    // Suositus: Määritä ADMIN_PASSWORD .env-tiedostoon tuotannossa!
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123"; 
    const role = "admin";

    // Tarkistetaan, onko admin jo olemassa
    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`ℹ️ Admin-käyttäjä '${username}' on jo olemassa. Ei toimenpiteitä.`);
      process.exit(0);
    }

    // Luodaan uusi admin
    console.log(`🔨 Luodaan uutta admin-käyttäjää: ${username}...`);
    
    // Hashataan salasana (bcryptjs)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const u = new User({ username, passwordHash, role });
    await u.save();

    console.log("✅ Admin-käyttäjä luotu onnistuneesti.");
    
    if (!process.env.ADMIN_PASSWORD) {
      console.warn("⚠️ VAROITUS: Käytettiin oletussalasanaa 'admin123'. Muista vaihtaa se heti tai asettaa ADMIN_PASSWORD ympäristömuuttujaan!");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Virhe adminin luonnissa:", err);
    process.exit(1);
  }
})();