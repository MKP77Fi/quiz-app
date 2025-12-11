// backend/utils/logger.js

const Log = require("../models/Log");

/**
 * ------------------------------------------------------------------
 * LOKITUSMOOTTORI (LOGGER UTILITY)
 * ------------------------------------------------------------------
 * Tämä funktio hoitaa varsinaisen kirjoitusoperaation tietokantaan.
 * Sitä kutsutaan yleensä loggerMiddlewaren kautta (req.logEvent),
 * mutta sitä voi käyttää myös suoraan taustaprosesseissa.
 *
 * @param {object} params - Lokituksen parametrit
 * @param {string} params.level - Vakavuusaste (info, warn, error, audit)
 * @param {string} params.event - Tekninen tunniste (esim. "db.connection.fail")
 * @param {string} params.message - Selkokielinen kuvaus
 * @param {object} params.user - Käyttäjäolio (jos tiedossa)
 * @param {object} params.req - Expressin request-olio (IP:n ja reitin päättelyyn)
 * @param {object} params.payload - Muu tallennettava data (EI henkilötietoja!)
 * @param {object} params.meta - Tekninen metadata (esim. suoritusajat)
 */
async function log({ 
  level = "info", 
  event, 
  message = "", 
  user = null, 
  req = null, 
  payload = null, 
  meta = null 
}) {
  try {
    // 1. Luodaan uusi lokidokumentti tietokantamallin (Log.js) mukaisesti
    const doc = new Log({
      level,
      event,
      message,
      // Jos käyttäjä on annettu, tallennetaan vain olennaiset tunnisteet
      user: user ? { 
        id: user._id || user.id, 
        username: user.username, 
        role: user.role 
      } : undefined,
      
      // IP-osoitteen päättely:
      // Pilvipalveluissa (Render/Vercel) oikea IP on usein x-forwarded-for -otsakkeessa
      ip: req ? (req.headers["x-forwarded-for"] || req.ip || null) : undefined,
      
      route: req ? req.originalUrl : undefined,
      method: req ? req.method : undefined,
      payload,
      meta
    });

    // 2. Tallennetaan tietokantaan
    await doc.save();

  } catch (err) {
    // 3. Vikasietoisuus (Fallback)
    // Jos tietokantaan ei saada yhteyttä, emme saa kaataa sovellusta lokituksen takia.
    // Tulostetaan virhe palvelimen konsoliin, jotta ylläpitäjä näkee sen logeista.
    console.error("❌ Logger critical error (DB save failed):", err);
  }
}

module.exports = { log };