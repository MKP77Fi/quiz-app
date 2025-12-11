// backend/middlewares/errorHandler.js

/**
 * ------------------------------------------------------------------
 * VIRHEIDEN KÄSITTELY (ERROR HANDLER MIDDLEWARE)
 * ------------------------------------------------------------------
 * Tämä on sovelluksen "turvaverkko". Jos missä tahansa muussa koodin
 * osassa tapahtuu virhe (esim. tietokantayhteys katkeaa tai koodi kaatuu),
 * Express siirtää käsittelyn tähän funktioon.
 *
 * TÄRKEÄÄ TIETOTURVASTA (Määrittely 11.8.4):
 * Tämä funktio varmistaa, että käyttäjälle EI KOSKAAN lähetetä teknistä
 * koodia tai tiedostopolkuja sisältävää virheilmoitusta (stack trace),
 * vaan ainoastaan yleinen ilmoitus virheestä.
 */

module.exports = async (err, req, res, next) => {
  // 1. Määritetään virhekoodi
  // Jos virheelle ei ole asetettu statusta (esim. koodi kaatui), oletetaan se vakavaksi palvelinvirheeksi (500).
  const statusCode = err.status || 500;

  // 2. Lokitetaan virhe tietokantaan (Määrittely 10.8)
  // Tämä on tarkoitettu ylläpitäjälle. Tänne tallennetaan KAIKKI tekninen tieto,
  // mukaan lukien "stack trace" (missä kohtaa koodia virhe tapahtui).
  if (req.logEvent) {
    try {
      await req.logEvent("error", "server.error", err.message, {
        stack: err.stack,        // Tekninen jäljitys
        path: req.originalUrl,   // Missä osoitteessa virhe tapahtui
        method: req.method,      // HTTP-metodi (GET, POST jne.)
        ip: req.ip               // Käyttäjän IP
      });
    } catch (loggingError) {
      // Jos jopa lokitus epäonnistuu, emme voi tehdä paljoa, mutta emme saa kaataa sovellusta.
      // Tässä tilanteessa hiljainen epäonnistuminen on turvallisinta.
    }
  }

  // 3. Muodostetaan viesti käyttäjälle (Määrittely 11.8.4)
  // Jos kyseessä on 500-virhe (palvelin rikki), piilotetaan tekninen syy ja näytetään yleinen viesti.
  // Jos kyseessä on esim. 400 (virheellinen syöte), näytetään alkuperäinen viesti.
  const clientMessage = statusCode === 500 
    ? "Sisäinen palvelinvirhe. Yritä myöhemmin uudelleen." 
    : (err.message || "Tuntematon virhe");

  // 4. Lähetetään vastaus
  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    // Tietoturva: Emme koskaan lähetä 'err.stack' -tietoa tässä vastauksessa tuotantoympäristössä.
  });
};