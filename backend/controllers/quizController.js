// backend/controllers/quizController.js

/**
 * ------------------------------------------------------------------
 * TENTIN HALLINTA (QUIZ CONTROLLER)
 * ------------------------------------------------------------------
 * Tämä ohjain hallinnoi tenttitilanteen elinkaarta (aloitus, lopetus, aikakatkaisu).
 * * HUOMIO TIETOSUOJASTA (GDPR & MÄÄRITTELY 10.3):
 * Sovellus EI tallenna tenttituloksia pysyvään tulostietokantaan tai
 * yhdistä niitä käyttäjän profiiliin. Nämä funktiot toimivat ainoastaan
 * tapahtumien kirjaajina (audit logging), jotta järjestelmän käyttöä
 * voidaan seurata teknisesti.
 */

/**
 * Kirjaa tentin aloitetuksi
 * - Kutsutaan, kun käyttäjä painaa "Aloita tentti" -painiketta.
 */
exports.startQuiz = async (req, res) => {
  try {
    // Haetaan käyttäjätieto (jos saatavilla) lokitusta varten
    const user = req.user?.username || "Anonymous";

    // Kirjataan tapahtuma lokiin
    await req.logEvent("info", "quiz.start", "Tentti aloitettu", { user });

    res.json({ success: true, message: "Tentti aloitettu" });
  } catch (err) {
    await req.logEvent("error", "quiz.start.error", err.message);
    res.status(500).json({ success: false, message: "Virhe tentin aloituksessa" });
  }
};

/**
 * Kirjaa tentin suoritetuksi ja tulokset lokiin
 * - Kutsutaan, kun käyttäjä on vastannut viimeiseen kysymykseen.
 * - Vastaanottaa frontendiltä lasketun pistemäärän vain lokitusta varten.
 */
exports.finishQuiz = async (req, res) => {
  try {
    const { score, total } = req.body;
    const user = req.user?.username || "Anonymous";

    // Varmistetaan, että pisteet ovat numeroita lokia varten
    const safeScore = typeof score === 'number' ? score : -1;
    const safeTotal = typeof total === 'number' ? total : -1;

    // Kirjataan suoritus tekniseen lokiin (ei tallennu käyttäjän profiiliin)
    await req.logEvent("info", "quiz.finish", "Tentti suoritettu", {
      user,
      score: safeScore,
      total: safeTotal,
      percentage: safeTotal > 0 ? Math.round((safeScore / safeTotal) * 100) + "%" : "0%"
    });

    res.json({ success: true, message: "Tentti suoritettu" });
  } catch (err) {
    await req.logEvent("error", "quiz.finish.error", err.message);
    res.status(500).json({ success: false, message: "Virhe tentin lopetuksessa" });
  }
};

/**
 * Kirjaa tentin aikakatkaisun
 * - Kutsutaan automaattisesti, jos tentin ajastin (timer) menee nollaan.
 */
exports.timeoutQuiz = async (req, res) => {
  try {
    const user = req.user?.username || "Anonymous";

    // Kirjataan varoitus-tason (warn) loki, koska tentti keskeytyi
    await req.logEvent("warn", "quiz.timeout", "Tenttiaika loppui kesken", { user });

    res.json({ success: true, message: "Tenttiaika päättyi" });
  } catch (err) {
    await req.logEvent("error", "quiz.timeout.error", err.message);
    res.status(500).json({ success: false, message: "Virhe aikakatkaisun käsittelyssä" });
  }
};