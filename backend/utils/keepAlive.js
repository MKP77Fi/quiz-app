// backend/utils/keepAlive.js
const https = require('https');

/**
 * ------------------------------------------------------------------
 * SERVER KEEP-ALIVE (RENDER FIX)
 * ------------------------------------------------------------------
 * Tämä apufunktio estää ilmaispalvelinta (kuten Render Free Tier)
 * nukahtamasta toimettomuuden vuoksi.
 * * Toiminta:
 * Tekee HTTP-pyynnön palvelimen omaan osoitteeseen satunnaisin väliajoin
 * (3-13 min), mikä nollaa palveluntarjoajan "idle timerin".
 * * @param {string} serverUrl - Sovelluksen julkinen URL
 */
const startKeepAlive = (serverUrl) => {
  // 1. Estetään toiminta kehitysympäristössä (localhost) tai jos URL puuttuu
  if (!serverUrl || serverUrl.includes('localhost')) {
    console.log('ℹ️  Keep-alive: Ei käytössä (Localhost tai URL puuttuu).');
    return;
  }

  console.log(`🟢 Keep-alive: Aktivoitu kohteeseen ${serverUrl}`);

  // Renderin timeout on tyypillisesti 15 min. Pysytään sen alla.
  const MIN_MINUTES = 3;
  const MAX_MINUTES = 13;

  const performPing = () => {
    https.get(serverUrl, (res) => {
      // Ping onnistui. Emme tulosta lokia onnistumisista, jotta tuotantoloki pysyy siistinä.
      // Tärkeintä on, että pyyntö tehtiin.
      
      // Ajastetaan seuraava ping vasta kun edellinen on valmis
      scheduleNextPing();
    }).on('error', (err) => {
      // Vain virheet raportoidaan
      console.error(`⚠️  Keep-alive virhe: ${err.message}`);
      
      // Ajastetaan seuraava myös virhetilanteessa, jotta looppi ei katkea
      scheduleNextPing();
    });
  };

  const scheduleNextPing = () => {
    // Lasketaan satunnainen viive, painottaen pidempiä aikoja (säästää resursseja)
    // Math.sqrt(Math.random()) siirtää jakaumaa kohti ykköstä.
    const weightedRandom = Math.sqrt(Math.random());
    const randomMinutes = MIN_MINUTES + (weightedRandom * (MAX_MINUTES - MIN_MINUTES));
    const delayMs = Math.floor(randomMinutes * 60 * 1000);

    // Hiljainen ajastus ilman konsolitulostetta
    setTimeout(performPing, delayMs);
  };

  // Käynnistetään sykli
  scheduleNextPing();
};

module.exports = startKeepAlive;