🧠 TSW Group – Ajolupaharjoittelu

Tämä projekti on interaktiivinen verkkopohjainen tentti- ja harjoittelusovellus, joka on toteutettu osana Taitotalon ohjelmistokehityskoulutusta.Sovelluksen tavoitteena on tarjota harjoittelijoille, opettajille ja ylläpidolle alusta kysymysten hallintaan, tenttien suorittamiseen ja käyttäjähallintaan turvallisesti. Sovellus on julkaistu tuotantoon hyödyntäen pilvipalveluita.

🧱 Arkkitehtuuri ja Teknologiat

Sovellus on jaettu kahteen erilliseen kokonaisuuteen (frontend ja backend), jotka kommunikoivat REST API:n välityksellä.

OsaTeknologiaHosting / AlustaKuvaus
BackendNode.js + Express + MongoDBRenderVastaa tietokannasta, autentikoinnista ja API-rajapinnoista.
FrontendReact (Vite) + TailwindCSSVercelResponsiivinen käyttöliittymä ja sovelluslogiikka.

Hakemistorakenne

quiz-app/
├── backend/           # Node.js + MongoDB (Render)
│   ├── controllers/   # Sovelluslogiikka
│   ├── models/        # Mongoose-tietomallit
│   ├── routes/        # REST API -reitit
│   └── server.js      # Serverin käynnistys
│
├── frontend/          # React + Vite (Vercel)
│   ├── src/components/# UI-komponentit (mm. RouteAnimation, SplashScreen)
│   ├── src/views/     # Näkymät (Login, Quiz, Admin)
│   └── main.jsx
│
└── docs/              # Dokumentaatio

🚀 Render "Cold Start" & Herätysmekanismi

Koska backendia ajetaan Renderin ilmaisversiolla, palvelin menee lepotilaan (spin down), kun sitä ei käytetä hetkeen. Uudelleenkäynnistys (Cold Start) voi kestää 30–60 sekuntia.

Tämän hallitsemiseksi sovellukseen on rakennettu älykäs latausmekanismi:

Animaatio (RouteAnimation): Kun käyttäjä saapuu sivulle, näytetään autoanimaatio (n. 9 sekuntia). Samalla taustalla lähetetään herätyspyyntö backendiin.

Splash Screen: Jos backend ei ole herännyt animaation aikana, käyttäjä siirretään latausruutuun, joka pollaa palvelinta kunnes yhteys on muodostettu.

Ready-tila: Kun yhteys on varmistettu, käyttäjä päästetään kirjautumisnäkymään.

🔐 Käyttäjäroolit ja tietoturva

Admin – hallinnoi kysymyksiä, käyttäjiä ja tenttiasetuksia.

Harjoittelija – suorittaa harjoittelu- tai tenttitilan.

Autentikointi: Käyttäjät tunnistetaan JWT-tokenilla (HTTP header: Authorization: Bearer <token>).

Salaukset: Salasanat tallennetaan bcrypt-hashattuina MongoDB:hen.

⚙️ Kehitysympäristön käyttöönotto (Localhost)

Jos haluat ajaa sovellusta paikallisesti omalla koneellasi:

1️⃣ Backend

cd backend
npm install
npm run dev # tai npm start


Luo .env tiedosto backend -kansioon:

MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<dbname>?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=salainen_avain_tahan
LOG_TTL_DAYS=90

2️⃣ Frontend

cd frontend
npm install
npm run dev

Luo .env tiedosto frontend -kansioon (tärkeä backend-yhteyden kannalta):

# Paikallisessa kehityksessä:
VITE_API_URL=http://localhost:3000/api

# Tuotannossa (Vercel-asetuksissa):
# VITE_API_URL=https://sinun-backend-sovellus.onrender.com/api

Sovellus toimii paikallisesti:

Backend: http://localhost:3000
Frontend: http://localhost:5173

☁️ Tuotantoympäristö (Deployment)

Sovellus on konfiguroitu toimimaan automaattisella CI/CD-putkella (tai manuaalisella deployauksella) seuraavasti:

Backend (Render):

Yhdistetty GitHub-repoon.
Build Command: npm install
Start Command: node server.js
Environment Variables: Määritelty Renderin Dashboardissa (MONGODB_URI, JWT_SECRET, jne).

Frontend (Vercel):

Yhdistetty GitHub-repoon.
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Environment Variables: VITE_API_URL osoittaa Renderin osoitteeseen.

🧪 Testaus

Postman / Insomnia:

Kirjautuminen: POST /api/auth/login
CRUD-reitit: /api/questions, /api/users
Huom: Muista lisätä saatu token headeriin testeissä.

Selaintasolla:Harjoittelutila ja tenttitila testattavissa käyttöliittymän kautta.
Admin-näkymät: kysymykset, käyttäjät, asetukset ja lokit.

📚 Lisätiedot

Tarkemmat ohjeet kunkin osion kehittämiseen löytyvät kansiokohtaisista ohjeista:

Backend README

Frontend README