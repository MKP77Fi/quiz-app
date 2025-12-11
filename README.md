# 🚖 TSW Group – Ajolupaharjoittelu (Full Stack)

Tämä repositorio sisältää TSW Groupin ajolupaharjoittelusovelluksen lähdekoodin. Sovellus on suunniteltu auttamaan taksinkuljettajia valmistautumaan ajolupakokeeseen.

Järjestelmä koostuu kahdesta osasta:
1.  **Backend (Node.js/Express):** Tietokanta, API ja logiikka.
2.  **Frontend (React/Vite):** Käyttöliittymä ja harjoittelutoiminnot.

---

## 🛠️ Pikaohje kehittäjälle (Local Dev)

Seuraa näitä ohjeita saadaksesi projektin pyörimään omalla koneellasi.

### 1. Esivaatimukset
* Node.js (versio 18 tai uudempi)
* MongoDB Atlas -tietokantatunnukset (tai paikallinen MongoDB)

### 2. Asennus
Aja projektin juuressa seuraava komento. Se asentaa tarvittavat kirjastot juureen, backendiin ja frontendiin yhdellä kertaa.

```bash
npm run setup
3. Ympäristömuuttujat (.env)Sinun tulee luoda kaksi .env-tiedostoa manuaalisesti, koska ne sisältävät salaisuuksia eivätkä ne ole Gitissä.A) Backend (/backend/.env):KoodinpätkäMONGODB_URI=mongodb+srv://... (Pyydä tämä ylläpidolta)
PORT=3000
JWT_SECRET=oma_salainen_dev_avain
B) Frontend (/frontend/.env):KoodinpätkäVITE_API_URL=http://localhost:3000/api
4. KäynnistysKäynnistä koko järjestelmä (sekä serveri että client) yhdellä komennolla projektin juuresta:Bashnpm run dev
Frontend: http://localhost:5173Backend: http://localhost:3000☁️ Tuotantoympäristö & ArkkitehtuuriSovellus on jaettu kahteen eri pilvipalveluun suorituskyvyn optimoimiseksi.KomponenttiPalveluHuomioitavaaFrontendVercelStaattinen sivusto, nopea CDN.BackendRenderNode.js-palvelin (Free Tier). Menee nukkumaan 15min inaktiivisuuden jälkeen ("Cold Start").TietokantaMongoDB AtlasPilvitietokanta.Render "Cold Start" -huomioFrontend sisältää RouteAnimation-mekanismin, joka viihdyttää käyttäjää sen aikaa, kun Render-palvelin herää (n. 30-60s).🔐 Hallintapaneeli (Admin)Järjestelmässä on sisäänrakennettu Admin-käyttäjäliittymä kysymysten ja käyttäjien hallintaan.Kirjaudu sisään Admin-tunnuksilla nähdäksesi hallintatyökalut.Uuden Adminin luonti (jos tietokanta on tyhjä):node backend/scripts/createAdmin.js📁 Kansiorakenne/backend - Palvelin, API-reitit, Tietokantamallit./frontend - React-sovellus, Tyylit (Tailwind), Komponentit.