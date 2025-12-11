// backend/middlewares/loggerMiddleware.js

const logger = require("../utils/logger");

/**
 * ------------------------------------------------------------------
 * LOKITUS-MIDDLEWARE (LOGGER MIDDLEWARE)
 * ------------------------------------------------------------------
 * Tämä middleware "varustelee" jokaisen saapuvan HTTP-pyynnön
 * älykkäällä lokitustoiminnolla.
 *
 * Sen sijaan, että jokaiseen tiedostoon pitäisi tuoda logger erikseen,
 * kontrollerit voivat kutsua suoraan:
 * await req.logEvent("info", "event.name", "Viesti");
 *
 * Tämä varmistaa, että:
 * 1. Kaikki lokit noudattavat samaa muotoa (Määrittely 11.8.5).
 * 2. Käyttäjätieto (jos kirjautunut) liitetään lokiin automaattisesti.
 */
function loggerMiddleware(req, res, next) {
  /**
   * Apufunktio tapahtumien kirjaamiseen.
   *
   * @param {string} level - Lokin taso ("info", "warn", "error")
   * @param {string} event - Tapahtuman tekninen nimi (esim. "auth.login")
   * @param {string} message - Selkokielinen kuvaus
   * @param {object} payload - (Valinnainen) Lisätiedot
   * @param {object} meta - (Valinnainen) Metadata
   */
  req.logEvent = async (level, event, message, payload = null, meta = null) => {
    
    // Yritetään tunnistaa käyttäjä automaattisesti
    // req.user tulee authMiddlewaresta (JWT)
    // req.session on varalla, jos sessioita käytetään tulevaisuudessa
    const user =
      req.user ||
      (req.session && req.session.user) ||
      null;

    // Lähetetään tiedot varsinaiselle logger-työkalulle
    await logger.log({
      level,
      event,
      message,
      user,     // Kuka teki?
      req,      // Sisältää IP:n, selaimen tiedot yms.
      payload,  // Tapahtuman data
      meta,
    });
  };

  next(); // Siirrytään seuraavaan middlewareen tai kontrolleriin
}

module.exports = loggerMiddleware;