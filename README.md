🧠 TSW Group – Ajolupaharjoittelu-sovellus

Tämä projekti on interaktiivinen verkkopohjainen tentti- ja harjoittelusovellus, joka on toteutettu osana Taitotalon ohjelmistokehityskoulutusta.
Sovelluksen tarkoituksena on tarjota harjoittelijoille, opettajille ja ylläpidolle alusta kysymysten hallintaan, tenttien suorittamiseen ja käyttäjätunnusten hallintaan turvallisesti.

📋 Kokonaisrakenne

Sovellus on toteutettu kaksiosaisena kokonaisuutena:

Osa	Teknologia	Kuvaus
Backend	Node.js + Express + MongoDB (Mongoose)	Vastaa tietokantayhteyksistä, käyttäjien autentikoinnista ja API-rajapinnoista
Frontend	React (Vite)	Käyttöliittymä, jossa käyttäjä kirjautuu, valitsee toimintatilan ja suorittaa tentin tai hallinnoi dataa
⚙️ Projektin rakenne
quiz-app/
│
├── backend/                  # Node.js + Express + MongoDB
│   ├── controllers/          # Sovelluslogiikka (auth, questions, users)
│   ├── models/               # Tietokantamallit (Question, User)
│   ├── routes/               # Rajapinnat (API-reitit)
│   ├── middlewares/          # JWT-tokenin ja admin-oikeuksien tarkistus
│   ├── scripts/              # Ylläpidon apuskriptit (esim. adminin luonti)
│   ├── server.js             # Backendin käynnistyspiste
│   └── .env.example          # Malli ympäristömuuttujille
│
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginView.jsx
│   │   │   ├── ModeSelector.jsx
│   │   │   ├── PracticeView.jsx
│   │   │   ├── QuizView.jsx
│   │   │   ├── AdminView.jsx
│   │   │   └── UserManagement.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docs/                     # Dokumentaatio (määrittely, arkkitehtuuri, toteutus, error-log)
├── README.md                 # Tämä tiedosto
└── .gitignore

🧩 Keskeiset toiminnot
🔐 Kirjautuminen ja roolit

Käyttäjät tunnistetaan JWT-tokenilla, joka tallennetaan istunnon ajaksi selaimen muistiin.

Käyttäjät tallennetaan MongoDB Atlas -tietokantaan.

Käytettävissä kaksi roolia:

Admin – pääsee hallintanäkymään, jossa voi muokata kysymyksiä ja käyttäjiä (CRUD)

Harjoittelija – valitsee harjoittelu- tai tenttitilan

🧠 Tentti- ja harjoittelutilat

Tenttitila: vastaukset eivät näy heti; lopuksi tuloskooste

Harjoittelutila: näyttää heti, onko vastaus oikein

Yksi kysymys kerrallaan, manuaalinen siirtyminen “Seuraava”-painikkeella

Dynaaminen tietojen haku tietokannasta (GET /api/questions)

💾 Kysymysten ja käyttäjien hallinta

Kaikki data tallennetaan MongoDB Atlas -tietokantaan

Admin voi käyttöliittymästä käsin:

Lisätä, muokata ja poistaa kysymyksiä

Hallinnoida käyttäjätilejä (luonti, muokkaus, poisto)

CRUD-toiminnot on suojattu verifyToken ja verifyAdmin -middlewareilla

🧭 Käyttöönotto
1️⃣ Backend
cd backend
npm install
npm start


📄 Luo tarvittaessa .env-tiedosto. Malli löytyy .env.example-tiedostosta.

.env-tiedoston sisältöesimerkki:

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=salainen_avain

2️⃣ Frontend
cd frontend
npm install
npm run dev


Sovellus toimii oletuksena seuraavissa osoitteissa:

Backend: http://localhost:3000

Frontend: http://localhost:5173

🧪 Testaus
Postman

Kirjautuminen: POST /api/auth/login

Tarkista, että token palautuu oikein

Kysymysten CRUD: POST/PUT/DELETE /api/questions

Käyttäjien CRUD: POST/PUT/DELETE /api/users

Tokenin tarkistus: lisää headeriin Authorization: Bearer <token>

Frontend

Kirjaudu sisään (admin tai harjoittelija)

Harjoittelija voi valita harjoittelun tai tentin

Admin voi hallita kysymyksiä ja käyttäjiä

Testaa uloskirjautuminen molemmissa rooleissa

🔒 Tietoturva

Kaikki salasanat tallennetaan bcrypt-hashattuina

Rajapinnat suojataan JWT-tunnisteilla

Ympäristömuuttujat (.env) eivät kuulu versionhallintaan

Admin-oikeudet tarkistetaan aina middleware-tasolla

🧰 Käytetyt kirjastot
Kirjasto	Tarkoitus
express	Backend-palvelin ja reititys
mongoose	MongoDB-tietokantayhteys
jsonwebtoken	JWT-tokenien luonti ja tarkistus
bcrypt	Salasanojen hashäys
cors	CORS-suojausten hallinta
dotenv	Ympäristömuuttujien käsittely
react / vite	Frontend-käyttöliittymä
react-router-dom	Navigointi eri näkymien välillä
