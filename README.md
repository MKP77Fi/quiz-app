# 🧠 TSW Group – Ajolupaharjoittelu-sovellus

Tämä projekti on interaktiivinen **verkkopohjainen tentti- ja harjoittelusovellus**, joka on toteutettu osana Taitotalon ohjelmistokehityskoulutusta.  
Sovelluksen tarkoituksena on tarjota harjoittelijoille ja opettajille alusta kysymysten hallintaan, tenttien suorittamiseen ja tulosten seuraamiseen.

---

## 📋 Kokonaisrakenne

Sovellus on toteutettu kaksiosaisena kokonaisuutena:

| Osa | Teknologia | Kuvaus |
|------|-------------|--------|
| **Backend** | Node.js + Express + MongoDB | Vastaa tietokantayhteyksistä, käyttäjien autentikoinnista ja API-rajapinnoista |
| **Frontend** | React (Vite) | Käyttöliittymä, jossa käyttäjä kirjautuu, valitsee tilan ja suorittaa tentin tai harjoittelun |

---

## ⚙️ Projektin rakenne

quiz-app/
│
├── backend/ # Node.js + Express + MongoDB
│ ├── routes/ # Rajapinnat
│ ├── controllers/ # Sovelluslogiikka
│ ├── models/ # Tietokantamallit
│ └── middleware/ # JWT-tarkistus
│
├── frontend/ # React + Vite
│ ├── src/
│ │ ├── components/
│ │ │ ├── LoginView.jsx
│ │ │ ├── ModeSelector.jsx
│ │ │ ├── PracticeView.jsx
│ │ │ ├── QuizView.jsx
│ │ │ └── AdminView.jsx
│ │ └── main.jsx
│ └── package.json
│
├── .env.example # Malli ympäristömuuttujille
├── README.md # Tämä tiedosto
└── docs/ # Dokumentaatio (määrittely, arkkitehtuuri, toteutus)

yaml
Kopioi koodi

---

## 🧩 Toiminnot lyhyesti

### 🔐 Kirjautuminen
- Käyttäjä tunnistetaan JWT-tokenilla
- Käytettävissä kaksi roolia:
  - **Admin** – hallintanäkymä kysymysten hallintaan  
  - **Harjoittelija** – valitsee tentti- tai harjoittelutilan

### 🧠 Tentti- ja harjoittelutila
- **Tenttitila:** vastaukset eivät näy heti, lopuksi tuloskooste  
- **Harjoittelutila:** näyttää heti, onko vastaus oikein  
- Yksi kysymys kerrallaan, manuaalinen siirtyminen

### 💾 Kysymysten hallinta
- Kysymykset tallennetaan MongoDB-tietokantaan  
- Admin voi luoda, muokata ja poistaa kysymyksiä (CRUD)

---

## 🧭 Käyttöönotto tiivistetysti

1. **Backend**
   ```bash
   cd backend
   npm install
   npm start
Luo tarvittaessa .env tiedosto (malli löytyy .env.example).

Frontend

bash
Kopioi koodi
cd frontend
npm install
npm run dev
Sovellus toimii oletuksena osoitteissa:

Backend → http://localhost:3000

Frontend → http://localhost:5173

🧪 Testaus
Kirjautumisen testaus Postmanilla (POST /api/auth/login)

Tokenin tarkistus middlewarella

Kysymysten haku (GET /api/questions)

Frontendin toiminnan testaus selaimessa:

Kirjautuminen (admin / harjoittelija)

Tilavalinta ja kysymysten läpikäynti

Uloskirjautuminen
