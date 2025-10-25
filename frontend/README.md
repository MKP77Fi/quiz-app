# 🧠 Quiz App – Frontend

Tämä kansio sisältää Quiz-sovelluksen käyttöliittymän (frontend), joka on toteutettu **Reactilla** ja **Vite-kehitysympäristöllä**.  
Frontend kommunikoi Node.js-pohjaisen backendin kanssa REST API -rajapinnan kautta.

---

## 🚀 Käyttöönotto

### 1. Asennus
```bash
cd frontend
npm install
2. Käynnistys
bash
Kopioi koodi
npm run dev
Sovellus avautuu selaimessa osoitteessa:
👉 http://localhost:5173

⚠️ Backendin tulee olla käynnissä osoitteessa http://localhost:3000, jotta API-yhteys toimii.

🔐 Kirjautuminen ja roolit
Sovellus sisältää kirjautumisen, jossa on kaksi eri käyttäjäroolia:

Käyttäjä	Tunnus	Salasana	Näkymä
Admin	admin	admin123	AdminView
Harjoittelija	harjoittelija	testi123	ModeSelector (valinta tentti/harjoittelu)

Token tallennetaan selaimen sessionStorage-muistiin kirjautumisen yhteydessä ja lähetetään API-kutsujen mukana.

🧩 Rakenne
bash
Kopioi koodi
frontend/
│
├── src/
│   ├── App.jsx              # Sovelluksen pääkomponentti
│   ├── main.jsx             # Käynnistyspiste
│   ├── components/
│   │   ├── LoginView.jsx    # Kirjautumissivu
│   │   ├── ModeSelector.jsx # Valinta tentti / harjoittelu
│   │   ├── PracticeView.jsx # Harjoittelutila
│   │   ├── QuizView.jsx     # Tenttitila
│   │   └── AdminView.jsx    # Admin-näkymä
│   └── styles/              # (valinnainen) Tyylitiedostot
│
└── package.json
⚙️ Toimintalogiikka
Käyttäjä kirjautuu sisään (LoginView.jsx)

Token tallennetaan selaimen sessionStorage-muistiin

Admin ohjataan AdminView.jsx-näkymään
Harjoittelija ohjataan ModeSelector.jsx-näkymään

ModeSelectorissa käyttäjä voi valita:

Harjoittelutila → PracticeView.jsx

Tenttitila → QuizView.jsx

Kysymykset haetaan backendin kautta (GET /api/questions)

🧪 Testaus
Käynnistä ensin backend komennolla npm start

Käynnistä frontend komennolla npm run dev

Kirjaudu sisään admin- tai harjoittelija-tunnuksilla

Testaa, että:

Kirjautuminen toimii

Harjoittelutila antaa palautteen heti

Tenttitila näyttää tuloksen vasta lopuksi

Uloskirjautuminen toimii molemmissa näkymissä

💡 Jatkokehitys
Käyttäjän tulosten tallennus tietokantaan

Adminin kysymysten hallintanäkymä (CRUD)

Tyylien yhtenäistäminen Tailwindilla

Responsiivisuuden ja saavutettavuuden parantaminen