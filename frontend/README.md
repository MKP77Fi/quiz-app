# 🧠 Quiz App – Frontend

Tämä hakemisto sisältää sovelluksen käyttöliittymän, joka on rakennettu Reactilla (Vite).  
Frontend hakee kysymykset backendin API:sta ja näyttää ne käyttäjälle joko harjoittelu- tai tenttitilassa.

## 📁 Rakenne

frontend/
├─ src/
│ ├─ components/
│ │ ├─ PracticeView.jsx # Harjoittelutila (palauttaa heti oikean vastauksen)
│ │ └─ QuizView.jsx # Tenttitila (siirtyy automaattisesti seuraavaan kysymykseen)
│ ├─ App.jsx # Pääsovellus, joka hallitsee näkymien välillä siirtymistä
│ ├─ main.jsx # Käynnistää React-sovelluksen
│ └─ index.css # Tyylit
└─ vite.config.js # Kehityspalvelimen asetukset

bash
Kopioi koodi

## ⚙️ Asennus ja käynnistys

1. Siirry frontend-kansioon:
   ```bash
   cd frontend
Asenna riippuvuudet:

bash
Kopioi koodi
npm install
Käynnistä kehityspalvelin:

bash
Kopioi koodi
npm run dev
Sovellus avautuu oletusarvoisesti osoitteeseen:

arduino
Kopioi koodi
http://localhost:5173
🔹 Backendin tulee olla käynnissä osoitteessa http://localhost:3000, jotta API-yhteys toimii.

🧠 Toiminnallisuus
Hakee kysymykset API:sta (GET /api/questions).

Näyttää yhden kysymyksen kerrallaan.

Tenttitila: siirtyy automaattisesti seuraavaan kysymykseen ja näyttää lopuksi tuloksen.

Harjoittelutila: kertoo heti, oliko vastaus oikein, ja mahdollistaa siirtymisen seuraavaan kysymykseen.

🧪 Testaus
Varmista, että backend on käynnissä.

Käynnistä frontend komennolla npm run dev.

Avaa selain ja varmista, että kysymykset näkyvät.

Testaa molemmat tilat (harjoittelu ja tentti).

✅ Tilanne
Perusrakenne luotu Viten kautta.

API-yhteys testattu ja toimii.

Toimivat komponentit harjoittelu- ja tenttitilalle.

Suunnitelma visuaalisen rakenteen ja pisteytyksen kehittämiseksi seuraavissa vaiheissa.