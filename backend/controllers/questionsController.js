// backend/controllers/questionsController.js

const Question = require("../models/Question");
const mongoose = require("mongoose");

/**
 * ------------------------------------------------------------------
 * HAE KAIKKI KYSYMYKSET (ADMIN)
 * ------------------------------------------------------------------
 * Hakee kaikki kysymykset tietokannasta admin-näkymän listausta varten.
 * Järjestää ne luontipäivämäärän mukaan (uusin ensin).
 */
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    // Admin-näkymässä virheet voidaan näyttää hieman tarkemmin konsolissa,
    // mutta API palauttaa vain yleisen virheen.
    res.status(500).json({ success: false, message: "Virhe kysymysten haussa" });
  }
};

/**
 * ------------------------------------------------------------------
 * HAE SATUNNAISET KYSYMYKSET (HARJOITTELU & TENTTI)
 * ------------------------------------------------------------------
 * Palauttaa N kappaletta satunnaisia kysymyksiä.
 * Käytetään sekä harjoittelutilassa (yleensä 1 kpl kerrallaan)
 * että tenttitilassa (esim. 10-20 kpl kerrallaan).
 * * Parametrit:
 * - amount: Kuinka monta kysymystä haetaan (oletus: 1)
 */
exports.getRandomQuestions = async (req, res) => {
  try {
    // Luetaan määrä URL-parametrista (esim. ?amount=10), oletuksena 1
    const size = parseInt(req.query.amount) || 1;

    // MongoDB:n aggregaatioputki:
    // 1. $sample: Valitsee satunnaiset dokumentit tehokkaasti suoraan tietokannasta
    const questions = await Question.aggregate([
      { $sample: { size: size } }
    ]);

    // Tietoturva: Varmistetaan, että vastaus sisältää vain tarvittavat kentät.
    // Harjoittelutilassa saatetaan tarvita oikea vastaus heti (client-side tarkistus),
    // tai se voidaan piilottaa riippuen toteutustavasta. Tässä palautetaan koko objekti.
    res.json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Virhe kysymysten arvonnassa" });
  }
};

/**
 * ------------------------------------------------------------------
 * LUO UUSI KYSYMYS (ADMIN)
 * ------------------------------------------------------------------
 * Tallentaa uuden kysymyksen ja sen vastausvaihtoehdot tietokantaan.
 */
exports.createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer, difficulty } = req.body;

    // 1. Validointi: Tarkistetaan pakolliset kentät
    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ success: false, message: "Kaikki kentät ovat pakollisia" });
    }

    // 2. Luodaan uusi kysymys-olio
    // difficulty on vapaaehtoinen kenttä (tulevaisuuden laajennuksia varten)
    const newQuestion = new Question({ questionText, options, correctAnswer, difficulty });
    
    // 3. Tallennetaan tietokantaan
    await newQuestion.save();

    // 4. Lokitetaan tapahtuma (admin-toiminto)
    await req.logEvent("info", "questions.create", "Kysymys lisätty", { id: newQuestion._id, questionText });

    res.status(201).json({ success: true, data: newQuestion });
  } catch (err) {
    await req.logEvent("error", "questions.create.error", err.message);
    res.status(500).json({ success: false, message: "Virhe kysymyksen luonnissa" });
  }
};

/**
 * ------------------------------------------------------------------
 * PÄIVITÄ KYSYMYS (ADMIN)
 * ------------------------------------------------------------------
 * Muokkaa olemassa olevan kysymyksen tietoja ID:n perusteella.
 */
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Tarkistetaan, onko ID validi MongoDB-objekti-ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Virheellinen kysymyksen ID" });
    }

    // Etsitään ja päivitetään kysymys. { new: true } palauttaa päivitetyn version.
    const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updated) {
      return res.status(404).json({ success: false, message: "Kysymystä ei löytynyt" });
    }

    await req.logEvent("info", "questions.update", "Kysymystä päivitetty", { id });

    res.json({ success: true, data: updated });
  } catch (err) {
    await req.logEvent("error", "questions.update.error", err.message);
    res.status(500).json({ success: false, message: "Virhe kysymyksen päivityksessä" });
  }
};

/**
 * ------------------------------------------------------------------
 * POISTA KYSYMYS (ADMIN)
 * ------------------------------------------------------------------
 * Poistaa kysymyksen pysyvästi tietokannasta.
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Poistetaan kysymys
    const deleted = await Question.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Kysymystä ei löytynyt" });
    }

    await req.logEvent("info", "questions.delete", "Kysymys poistettu", { id });

    res.json({ success: true, message: "Kysymys poistettu" });
  } catch (err) {
    await req.logEvent("error", "questions.delete.error", err.message);
    res.status(500).json({ success: false, message: "Virhe kysymyksen poistossa" });
  }
};