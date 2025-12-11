// backend/controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * ------------------------------------------------------------------
 * HAE KÄYTTÄJÄT (GET USERS)
 * ------------------------------------------------------------------
 * Hakee listan kaikista käyttäjistä Admin-näkymää varten.
 * Tietoturva: Palauttaa käyttäjätunnukset ja roolit, mutta
 * suodattaa pois salasana-hashit ({ passwordHash: 0 }).
 */
exports.getUsers = async (req, res) => {
  try {
    // .lean() muuntaa Mongoose-dokumentit tavallisiksi JS-objekteiksi (nopeampi)
    const users = await User.find({}, { passwordHash: 0 }).lean();
    res.json(users);
  } catch (err) {
    await req.logEvent("error", "users.get.error", err.message);
    res.status(500).json({ success: false, message: "Virhe käyttäjien haussa" });
  }
};

/**
 * ------------------------------------------------------------------
 * LUO KÄYTTÄJÄ (CREATE USER)
 * ------------------------------------------------------------------
 * Admin-toiminto uuden harjoittelijan tai adminin luomiseen.
 * - Hashaa salasanan ennen tallennusta.
 * - Estää duplikaattikimput.
 */
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // 1. Validointi
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Käyttäjätunnus ja salasana vaaditaan" });
    }

    // 2. Salasanan suojaus (bcrypt)
    // genSalt(10) luo satunnaisen suolan, joka estää sateenkaaritaulukkohyökkäykset
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Luodaan käyttäjä
    // Oletusrooli on "user" (harjoittelija), ellei muuta määritetä
    const newUser = new User({ 
      username, 
      passwordHash, 
      role: role || "user" 
    });

    await newUser.save();

    // 4. Lokitetaan tapahtuma
    await req.logEvent("info", "users.create", "Uusi käyttäjä lisätty", { username, role });

    // 5. Palautetaan luotu käyttäjä ilman salasanaa
    const result = newUser.toObject();
    delete result.passwordHash;
    
    res.status(201).json({ success: true, data: result });

  } catch (err) {
    // Käsitellään duplikaattivirhe (MongoDB koodi 11000)
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Käyttäjätunnus on jo käytössä" });
    }

    await req.logEvent("error", "users.create.error", err.message);
    res.status(500).json({ success: false, message: "Virhe käyttäjän luonnissa" });
  }
};

/**
 * ------------------------------------------------------------------
 * PÄIVITÄ KÄYTTÄJÄ (UPDATE USER)
 * ------------------------------------------------------------------
 * Mahdollistaa käyttäjänimen, roolin tai salasanan vaihtamisen.
 * Jos salasana vaihdetaan, se hashaataan uudelleen.
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = {};

    // Päivitetään vain kentät, jotka on annettu pyynnössä
    if (req.body.username) update.username = req.body.username;
    if (req.body.role) update.role = req.body.role;

    // Jos salasana on annettu, se pitää suojata uudelleen
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      update.passwordHash = await bcrypt.hash(req.body.password, salt);
    }

    // { new: true } palauttaa päivitetyn dokumentin
    // { runValidators: true } varmistaa tietokantatason säännöt
    const updated = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .select("-passwordHash"); // Poistetaan hash vastauksesta

    if (!updated) {
      return res.status(404).json({ success: false, message: "Käyttäjää ei löytynyt" });
    }

    await req.logEvent("info", "users.update", "Käyttäjää päivitetty", { id });

    res.json({ success: true, data: updated });
  } catch (err) {
    // Duplikaattitarkistus myös päivityksessä (jos vaihdetaan nimi jo olemassa olevaan)
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Käyttäjätunnus on jo käytössä" });
    }
    
    await req.logEvent("error", "users.update.error", err.message);
    res.status(500).json({ success: false, message: "Virhe käyttäjän päivityksessä" });
  }
};

/**
 * ------------------------------------------------------------------
 * POISTA KÄYTTÄJÄ (DELETE USER)
 * ------------------------------------------------------------------
 * Poistaa käyttäjätunnuksen pysyvästi.
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await User.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Käyttäjää ei löytynyt" });
    }

    await req.logEvent("info", "users.delete", "Käyttäjä poistettu", { id, username: deleted.username });

    res.json({ success: true, message: "Käyttäjä poistettu" });
  } catch (err) {
    await req.logEvent("error", "users.delete.error", err.message);
    res.status(500).json({ success: false, message: "Virhe käyttäjän poistossa" });
  }
};