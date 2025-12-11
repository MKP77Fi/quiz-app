# 🎨 Frontend – Ajoluvan harjoitusympäristö

Tämä on sovelluksen käyttöliittymä (Frontend), joka on toteutettu **React**:illa ja **Vite**:llä. Se on optimoitu toimimaan **Vercel**-alustalla ja kommunikoimaan Renderissä sijaitsevan backendin kanssa.

Sovellus on suunniteltu "Mobile First" -periaatteella ja se käyttää **Tailwind CSS**:ää visuaalisen ilmeen hallintaan.

## 🚀 Teknologiat

| Teknologia | Tarkoitus |
| :--- | :--- |
| **React (Vite)** | Komponenttipohjainen UI-kirjasto ja nopea build-työkalu |
| **Tailwind CSS** | Moderni utility-first tyylitys (korvaa erilliset CSS-tiedostot) |
| **React Router** | SPA-reititys (Single Page Application) näkymien välillä |
| **Session Storage** | JWT-tokenin ja istuntotietojen väliaikainen tallennus |
| **Fetch API** | Natiivi tapa kommunikoida backendin REST API:n kanssa |

---

## 🛌 Render & "Cold Start" -mekanismi

Koska backend pyörii Renderin ilmaisversiolla, se "nukahtaa" 15 minuutin käyttämättömyyden jälkeen. Herääminen kestää n. 30–60 sekuntia. Frontend piilottaa tämän viiveen käyttäjältä älykkäällä latausprosessilla:

1.  **Vaihe 1: RouteAnimation (0-10s)**
    * Kun käyttäjä saapuu sivulle, käynnistyy animaatio (taksi ajaa spiraalia).
    * Taustalla frontend yrittää "herättää" backendin (`GET /`).
    * Jos backend vastaa heti, animaatio keskeytyy ja sovellus aukeaa.

2.  **Vaihe 2: SplashScreen (10s -> )**
    * Jos backend ei ehdi vastata animaation aikana, näytetään latausruutu ("Herätellään palvelinta...").
    * Tämä komponentti jatkaa yhteyden yrittämistä (polling) kunnes backend vastaa.

3.  **Istunto:**
    * Tieto animaation katsomisesta tallennetaan `sessionStorage`:en, jotta käyttäjän ei tarvitse katsoa sitä joka kerta, kun hän päivittää sivun.

---

## 📂 Rakenne

```text
frontend/
├── public/
│   └── favicon.png          # Selaimen välilehden ikoni
├── src/
│   ├── assets/              # Kuvat (Logo.png)
│   ├── components/          # React-komponentit
│   │   ├── RouteAnimation.jsx   # Herätysmekanismi A
│   │   ├── SplashScreen.jsx     # Herätysmekanismi B
│   │   ├── LoginView.jsx        # Kirjautuminen
│   │   ├── ModeSelector.jsx     # Valikko (Harjoittelu/Tentti)
│   │   ├── PracticeView.jsx     # Harjoittelutila (Välitön palaute)
│   │   ├── QuizView.jsx         # Tenttitila (Aikaraja)
│   │   ├── AdminDashboard.jsx   # Ylläpitäjän valikko
│   │   └── ... (Muut Admin-näkymät: Users, Questions, Settings, Logs)
│   ├── utils/               # Apufunktiot (api.js - varalla)
│   ├── App.jsx              # Pääreititin
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwindin konfiguraatio ja globaalit tyylit
├── index.html               # HTML-runko ja fontit
├── package.json             # Riippuvuudet ja skriptit
├── tailwind.config.js       # Teemavärit ja animaatiot
└── vite.config.js           # Build-asetukset
⚙️ Asennus ja konfigurointi
Frontend tarvitsee tiedon siitä, missä backend sijaitsee. Tämä määritellään ympäristömuuttujissa.

1. Asennus
Lataa tarvittavat kirjastot (React, Tailwind, Router):

Bash

npm install
2. Ympäristömuuttujat (.env)
Luo frontend-kansion juureen tiedosto .env ja määritä backendin osoite.

Paikallinen kehitys (Localhost):

Koodinpätkä

VITE_API_URL=http://localhost:3000/api
Tuotanto (Vercel): Vercelin hallintapaneelissa (Project Settings -> Environment Variables) määritä:

Koodinpätkä

VITE_API_URL=[https://sinun-backend-sovellus.onrender.com/api](https://sinun-backend-sovellus.onrender.com/api)
3. Käynnistys
Bash

# Kehitystila (Hot Reload)
npm run dev

# Tuotantobuildin testaus
npm run build
npm run preview
🔐 Tietoturva ja Autentikointi
JWT: Kirjautumisen jälkeen backend palauttaa tokenin. Frontend tallentaa sen sessionStorage:en.

Headerit: Suojatut API-kutsut (kuten admin-toiminnot) hakevat tokenin ja lisäävät sen pyynnön otsikoihin: Authorization: Bearer <token>.

Roolit: Käyttöliittymä ohjaa käyttäjän oikeaan näkymään (/admin tai /mode) kirjautumisvastauksen role-tiedon perusteella.

🎨 Ulkoasu
Fontit: 'Racing Sans One' (Otsikot) ja 'Barlow' (Leipäteksti) ladataan Google Fontsista index.html-tiedostossa.

Värit: Määritelty tailwind.config.js:ssä ja index.css:ssä:

accent-turquoise (#1cb1cf)

accent-orange (#ff6b35)

background (#1a1a1a)


### 5. Tiivistelmä tiedoston toiminnasta

**Tiedosto:** `frontend/README.md`

**Rooli kokonaisuudessa:**
Tämä on frontendin käyttöohje.

**Keskeiset tehtävät:**
1.  **Tekninen dokumentaatio:** Selittää, miten Renderin "herätysmekanismi" on toteutettu kooditasolla.
2.  **Kehittäjän opas:** Kertoo, miten `.env`-tiedosto pitää konfiguroida, jotta frontend löytää backendin (paikallisesti tai pilvessä).
3.  **Yleiskuva:** Listaa sovelluksen rakenteen ja käytetyt teknologiat.