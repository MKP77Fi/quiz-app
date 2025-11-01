🧠 Quiz App – Frontend

Tämä hakemisto sisältää Quiz-sovelluksen käyttöliittymän, joka on toteutettu Reactilla ja Vite-kehitysympäristöllä.
Frontend kommunikoi backendin (Node.js + Express + MongoDB) kanssa REST API -rajapinnan kautta ja hyödyntää JWT-autentikointia.

🚀 Käyttöönotto
1. Asennus
cd frontend
npm install

2. Käynnistys
npm run dev


Sovellus avautuu selaimessa osoitteessa:
👉 http://localhost:5173

⚠️ Huom: Backendin tulee olla käynnissä osoitteessa http://localhost:3000
, jotta API-yhteys toimii oikein.

🔐 Kirjautuminen ja käyttäjäroolit

Sovelluksessa on kaksi erillistä käyttäjäroolia, jotka ohjaavat eri näkymiin:

Käyttäjä	Tunnus	Salasana	Näkymä
Admin	admin	admin123	AdminView (hallintapaneeli)
Harjoittelija	harjoittelija	testi123	ModeSelector (valinta tentti / harjoittelu)

🔸 Kirjautumisen yhteydessä käyttäjä saa JWT-tokenin, joka tallennetaan selaimen sessionStorage-muistiin.
🔸 Token lähetetään automaattisesti kaikissa suojatuissa API-kutsuissa.
🔸 Uloskirjautuminen poistaa tokenin ja palauttaa käyttäjän kirjautumisnäkymään.

🧩 Rakenne
frontend/
│
├── src/
│   ├── App.jsx              # Sovelluksen reititys ja näkymähallinta
│   ├── main.jsx             # Sovelluksen käynnistyspiste
│   ├── components/
│   │   ├── LoginView.jsx     # Kirjautumissivu
│   │   ├── ModeSelector.jsx  # Valinta: tentti / harjoittelu
│   │   ├── PracticeView.jsx  # Harjoittelutila
│   │   ├── QuizView.jsx      # Tenttitila
│   │   ├── AdminView.jsx     # Admin-päänäkymä
│   │   ├── AdminQuestions.jsx # Kysymysten hallinta (CRUD)
│   │   └── AdminUsers.jsx    # Käyttäjien hallinta (CRUD)
│   └── styles/               # Tyylitiedostot (Tailwind / CSS)
│
└── package.json

⚙️ Toimintalogiikka

LoginView.jsx

Käyttäjä syöttää tunnuksensa → sovellus hakee tokenin backendiltä.

Token tallennetaan sessionStorageen.

Roolin tunnistus ja ohjaus:

Admin → AdminView.jsx

Harjoittelija → ModeSelector.jsx

ModeSelector.jsx

Käyttäjä voi valita:

Harjoittelutila → PracticeView.jsx

Tenttitila → QuizView.jsx

AdminView.jsx

Valinta kysymysten tai käyttäjien hallintaan:

AdminQuestions.jsx → kysymysten CRUD

AdminUsers.jsx → käyttäjien CRUD

Kysymykset ja käyttäjät haetaan backendin kautta (GET /api/questions, GET /api/users).

Uloskirjautuminen toimii kaikissa näkymissä poistamalla tokenin ja päivittämällä tilan.

🧪 Testaus

Käynnistä backend:

cd backend
npm start


Käynnistä frontend:

cd frontend
npm run dev


Testaa selaimessa osoitteessa http://localhost:5173

Tarkista, että:

Kirjautuminen toimii molemmilla rooleilla

Admin pystyy lisäämään, muokkaamaan ja poistamaan kysymyksiä

Admin pystyy hallitsemaan käyttäjiä (CRUD)

Harjoittelija voi valita tentti- tai harjoittelutilan

Harjoittelutila antaa palautteen heti

Tenttitila näyttää tulokset lopuksi

Uloskirjautuminen toimii kaikissa näkymissä

💡 Jatkokehitysehdotuksia

Tulosten tallennus tietokantaan (käyttäjäkohtaiset suoritukset)

Parempi virheenkäsittely ja käyttäjäviestit (esim. epäonnistuneet API-kutsut)

Tyylien yhtenäistäminen ja saavutettavuuden parantaminen

Responsiivinen ulkoasu mobiililaitteille

Adminin raporttinäkymät ja suodatus työkalut