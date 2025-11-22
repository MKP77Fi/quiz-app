🎨 Frontend – TSW Group Ajolupaharjoittelu

React (Vite) -pohjainen käyttöliittymä, joka on optimoitu toimimaan Vercel-alustalla. Sovellus sisältää "älykkään" latausmekanismin, joka käsittelee backendin (Render) kylmäkäynnistykset käyttäjäystävällisesti.

🚀 Teknologia

Osa

Kuvaus

React (Vite)

Nopea frontend-kehys ja build-työkalu

Vercel

Tuotantoympäristön hosting

TailwindCSS

Responsiivinen tyylittely

React Router

Reititys näkymien välillä

Fetch API

Kommunikointi backendin kanssa

Session Storage

JWT-tokenin ja animaatiotilan tallennus

📂 Rakenne ja uudet komponentit

frontend/
├── src/
│   ├── components/
│   │   ├── RouteAnimation.jsx    # 🆕 Herättää backendin taustalla
│   │   ├── SplashScreen.jsx      # 🆕 Pollaa backendia, jos herätys kestää
│   │   ├── LoginView.jsx
│   │   ├── ModeSelector.jsx
│   │   ├── PracticeView.jsx
│   │   ├── QuizView.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ... (Admin-hallintanäkymät)
│   ├── utils/
│   │   └── api.js                # API-kutsut (käyttää ympäristömuuttujia)
│   └── main.jsx

🛌 Backendin herätysmekanismi (Render Cold Start)

Koska backend pyörii Renderin ilmaisversiolla, se "nukahtaa" käyttämättömyyden jälkeen. Herääminen kestää n. 30–60 sekuntia. Frontend hallitsee tätä seuraavasti:

RouteAnimation: Sovelluksen käynnistyessä näytetään n. 10 sekunnin auto-animaatio. Samalla taustalla lähetetään "ping"-pyyntö backendille.

SplashScreen: Jos backend ei ehdi vastata animaation aikana, siirrytään latausruutuun, joka yrittää yhteyttä toistuvasti (polling) kunnes backend vastaa (200 OK tai 404).

Istunto: Tieto animaation katsomisesta tallennetaan sessionStorage:en, jotta sitä ei näytetä turhaan uudelleen saman istunnon aikana.

⚙️ Asennus ja Ympäristömuuttujat

Jotta frontend osaa keskustella backendin kanssa (joka on eri osoitteessa), on määriteltävä VITE_API_URL.

1. Asennus

npm install


2. Konfiguraatio (.env)

Luo juureen tiedosto .env:

# Paikallinen kehitys:
VITE_API_URL=http://localhost:3000/api

# TAI Tuotanto (Vercel Environment Variable):
# VITE_API_URL=[https://sinun-backend-sovellus.onrender.com/api](https://sinun-backend-sovellus.onrender.com/api)


3. Käynnistys

npm run dev


🔄 API-yhteys

Kaikki API-kutsut on keskitetty tai käyttävät ympäristömuuttujaa.
Esimerkki (src/utils/api.js):

// Hakee osoitteen .env -tiedostosta, fallback localhostiin
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};


🎨 Tyylit ja ulkoasu

TailwindCSS: Pääasiallinen tyylikirjasto.

Animaatiot: RouteAnimation käyttää SVG-polkuja ja CSS-animaatioita (@keyframes). SplashScreen käyttää scoped CSS -tyylejä varmistaakseen toimivuuden latausvaiheessa.

Responsiivisuus: Suunniteltu toimimaan mobiilissa ja työpöydällä.

🔧 Kehitystilanne

[x] Tuotantovalmis: Build-prosessi optimoitu Vercelille.

[x] UX: Cold start -viive piilotettu animaatiolla.

[x] Toimintatilat: Harjoittelu, Tentti ja Admin-hallinta toimivat.

[ ] Testaus: E2E-testaus (esim. Cypress) tulossa myöhemmin.