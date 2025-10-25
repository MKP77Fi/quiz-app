# TSW Ajolupakoe - Harjoitussovellus

Verkkopohjainen harjoitussovellus TSW Group Oy:n uusille työntekijöille ajoluvan kirjalliseen tenttiin valmistautumista varten.

## 📋 Projektin tilanne

### ✅ Valmiit ominaisuudet

**Backend:**
- ✅ MongoDB Atlas -yhteys
- ✅ Express-palvelin
- ✅ JWT-pohjainen autentikaatio
- ✅ Admin CRUD -toiminnot kysymyksille (POST, PUT, DELETE, GET)
- ✅ Auth middleware (token + roolin tarkistus)
- ✅ Kovakoodatut käyttäjät (admin, harjoittelija)

**Frontend:**
- ✅ Vite + React
- ✅ Kirjautumissivu
- ✅ Roolipohjainen navigointi
- ✅ Admin dashboard (placeholder CRUD-toiminnoille)
- ✅ Harjoittelija dashboard
- ✅ Harjoittelutila (välitön palaute)
- ✅ Tenttitila (tulos lopuksi)
- ✅ Session management
- ✅ Uloskirjautuminen

### 🚧 Työn alla / Tulossa

**Ensi viikko:**
- Admin CRUD -paneeli frontendissä (kysymysten hallinta)
- Käyttäjätunnusten hallinta
- Tenttiasetukset (kysymysmäärä)

**Tulevaisuudessa:**
- Kysymysten satunnaistaminen
- Tuloshistoria ja tilastointi
- Monikielisyys
- TaksiHelsinki-tentti

---

## 🚀 Käyttöönotto

### Edellytykset
- Node.js (v16 tai uudempi)
- MongoDB Atlas -tili
- Git

### 1. Kloonaa repositorio
```bash
git clone https://github.com/MKP77Fi/quiz-app.git
cd quiz-app
```

### 2. Backend-asetukset
```bash
# Luo .env-tiedosto projektin juureen
MONGO_URI=mongodb+srv://käyttäjä:salasana@cluster.mongodb.net/tietokanta
JWT_SECRET=vahva_satunnainen_avain_tähän
PORT=3000
```
```bash
# Asenna riippuvuudet
npm install

# Käynnistä backend
npm start
```

Backend pyörii osoitteessa: `http://localhost:3000`

### 3. Frontend-asetukset
```bash
# Siirry frontend-kansioon
cd frontend

# Asenna riippuvuudet
npm install

# Käynnistä dev-server
npm run dev
```

Frontend pyörii osoitteessa: `http://localhost:5173`

---

## 👥 Testikäyttäjät

### Admin
- Käyttäjätunnus: `admin`
- Salasana: `admin123`
- Oikeudet: Kysymysten ja käyttäjien hallinta

### Harjoittelija
- Käyttäjätunnus: `harjoittelija`
- Salasana: `harjoittelija123`
- Oikeudet: Harjoittelu ja tenttien tekeminen

---

## 🧪 Testaus

### Backend API (Postman/cURL)

**Kirjautuminen:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Hae kysymykset:**
```bash
GET http://localhost:3000/api/questions
```

**Luo kysymys (vaatii admin-tokenin):**
```bash
POST http://localhost:3000/api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionText": "Mikä on nopeusrajoitus taajamassa?",
  "options": ["30 km/h", "40 km/h", "50 km/h", "60 km/h"],
  "correctAnswer": "50 km/h",
  "difficulty": "easy"
}
```

### Frontend-flow

1. Avaa `http://localhost:5173`
2. Kirjaudu adminina tai harjoittelijana
3. Testaa roolipohjaisia toimintoja

---

## 📁 Projektin rakenne
```
quiz-app/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── questions.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── questionsController.js
│   ├── models/
│   │   └── Question.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── db.js
│   └── scripts/
│       └── generateHash.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── TraineeDashboard.jsx
│   │   │   └── QuizView.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── .env
├── package.json
└── README.md
```

---

## 🛠️ Teknologiat

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

### Frontend
- React 18
- Vite
- Vanilla CSS (inline styles)

---

## 📝 Lisenssit ja tekijät

**Projekti:** TSW Group Oy - Ajolupakoe harjoitussovellus  
**Opiskelija:** [Nimi]  
**Kurssi:** [Kurssinimi]  
**Vuosi:** 2025

---

## 🐛 Tiedossa olevat ongelmat

- Ei vielä tunnettuja ongelmia

---

## 📞 Yhteystiedot

Kysymyksiä tai ongelmia? Ota yhteyttä projektin omistajaan.