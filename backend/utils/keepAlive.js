const https = require('https');

/**
 * Pitää Render-palvelimen hereillä tekemällä pyynnön itseensä satunnaisin väliajoin.
 * Käyttää väliä 3-13 minuuttia, painottaen pidempiä aikoja.
 * * @param {string} serverUrl - Sovelluksen julkinen URL
 */
const startKeepAlive = (serverUrl) => {
  // Estä toiminta, jos URL puuttuu tai ollaan lokaalissa kehityksessä
  if (!serverUrl || serverUrl.includes('localhost')) {
    console.log('Keep-alive: Ei käytössä (Localhost tai URL puuttuu).');
    return;
  }

  console.log(`Keep-alive: Käynnistetty kohteeseen ${serverUrl}`);

  const MIN_MINUTES = 3;
  const MAX_MINUTES = 13;

  const performPing = () => {
    https.get(serverUrl, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        console.log(`Keep-alive ping onnistui: ${serverUrl} (Status: ${res.statusCode})`);
      } else {
        console.warn(`Keep-alive ping vastasi oudolla koodilla: ${res.statusCode}`);
      }
      // Ajastetaan seuraava vasta kun edellinen on valmis
      scheduleNextPing();
    }).on('error', (err) => {
      console.error(`Keep-alive ping epäonnistui: ${err.message}`);
      // Ajastetaan seuraava myös virhetilanteessa, jotta looppi ei katkea
      scheduleNextPing();
    });
  };

  const scheduleNextPing = () => {
    // Lasketaan satunnainen viive
    // Math.random() antaa luvun 0-1.
    // Math.sqrt() painottaa lukuja kohti ykköstä (eli kohti maksimiaikaa).
    // Esim: Jos random on 0.25, sqrt on 0.5. Jos random on 0.81, sqrt on 0.9.
    const weightedRandom = Math.sqrt(Math.random());
    
    const randomMinutes = MIN_MINUTES + (weightedRandom * (MAX_MINUTES - MIN_MINUTES));
    const delayMs = Math.floor(randomMinutes * 60 * 1000);

    console.log(`Keep-alive: Seuraava ping n. ${(randomMinutes).toFixed(1)} min kuluttua.`);

    setTimeout(performPing, delayMs);
  };

  // Käynnistetään ensimmäinen ajastus
  scheduleNextPing();
};

module.exports = startKeepAlive;