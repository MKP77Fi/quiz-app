# 🧠 TSW Group – Ajolupaharjoittelu

Tämä projekti on interaktiivinen verkkopohjainen **tentti- ja harjoittelusovellus**, joka on toteutettu osana **Taitotalon ohjelmistokehityskoulutusta**.  
Sovelluksen tavoitteena on tarjota harjoittelijoille, opettajille ja ylläpidolle alusta kysymysten hallintaan, tenttien suorittamiseen ja käyttäjähallintaan turvallisesti.

---

## 🧱 Rakenne

| Osa | Teknologia | Kuvaus |
|------|-------------|---------|
| **Backend** | Node.js + Express + MongoDB | Vastaa tietokantayhteyksistä, autentikoinnista ja API-rajapinnoista |
| **Frontend** | React (Vite) + TailwindCSS | Käyttöliittymä, jossa käyttäjä kirjautuu, valitsee toimintatilan ja suorittaa tentin tai hallinnoi dataa |

quiz-app/
├── backend/ # Node.js + MongoDB
│ ├── controllers/ # Sovelluslogiikka
│ ├── models/ # Mongoose-tietomallit
│ ├── routes/ # REST API -reitit
│ ├── middlewares/ # verifyToken, verifyAdmin
│ └── server.js
│
├── frontend/ # React + Vite
│ ├── src/components/
│ ├── src/utils/
│ └── main.jsx
│
└── docs/ # Dokumentaatio (määrittely, arkkitehtuuri, testaus)

yaml
Kopioi koodi

---

## 🔐 Käyttäjäroolit ja kirjautuminen

- **Admin** – hallinnoi kysymyksiä, käyttäjiä ja tenttiasetuksia  
- **Harjoittelija** – suorittaa harjoittelu- tai tenttitilan  
- Käyttäjät tunnistetaan **JWT-tokenilla** (sessionStorage)  
- Salasanat tallennetaan **bcrypt-hashattuina** MongoDB:hen

---

## 🧠 Sovelluksen tilat

| Tila | Kuvaus |
|------|--------|
| **Harjoittelutila** | Näyttää heti onko vastaus oikein, yksi kysymys kerrallaan |
| **Tenttitila** | Ei palauta tulosta ennen lopetusta; pisteet ja aikaraja |
| **Admin-hallinta** | Kysymysten ja käyttäjien CRUD-toiminnot, lokien katselu |
| **Lokit** | Kaikki merkittävät tapahtumat tallennetaan MongoDB:hen (asetettavissa `LOG_TTL_DAYS`) |

---

## ⚙️ Käyttöönotto

### 1️⃣ Backend
```bash
cd backend
npm install
npm start

Luo tarvittaessa .env tiedosto .env.example -mallin pohjalta:

MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<dbname>?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=salainen_avain
LOG_TTL_DAYS=90

2️⃣ Frontend
cd frontend
npm install
npm run dev


Sovellus toimii:

Backend: http://localhost:3000

Frontend: http://localhost:5173

🧪 Testaus
Postman

Kirjautuminen: POST /api/auth/login

CRUD-reitit: /api/questions, /api/users, /api/settings, /api/logs

Lisää header: Authorization: Bearer <token>

Frontend

Kirjaudu (admin tai harjoittelija)

Harjoittelutila ja tenttitila testattavissa ModeSelectorin kautta

Admin-hallinta: kysymykset, käyttäjät, asetukset ja lokit

🔒 Tietoturva

JWT-pohjainen autentikointi

Bcrypt-salasanojen suojaus

verifyToken ja verifyAdmin -middlewaret

Ympäristömuuttujat pidetään versionhallinnan ulkopuolella

🚧 Kehitystilanne

Tämä on kehitysvaiheen versio.
Seuraavaksi vuorossa:

🧩 Käyttöliittymätestaus ja UX-parannukset

🧠 Lokitietojen analytiikka

📊 Mahdollinen raportointinäkymä

📚 Lisätiedot

Frontend README

Backend README