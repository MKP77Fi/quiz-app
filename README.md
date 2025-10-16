# 🧠 TSW Group – Ajolupaharjoittelu-sovellus

Tämä projekti on osa Taitotalon ohjelmistokehityksen näyttöä ja on toteutettu yhteistyössä **TSW Group Oy:n** kanssa.  
Sovellus tarjoaa harjoitteluympäristön taksinkuljettajan ajolupakokeen kirjalliseen osioon valmistautuville työnhakijoille.  
Tavoitteena on helpottaa kokeeseen valmistautumista ja varmistaa, että työnhakijat pääsevät virallisesta ajolupakokeesta läpi mahdollisimman tehokkaasti.

---

## 📋 Projektin rakenne

quiz-app/
│
├─ backend/ # Palvelin, API ja tietokantayhteys
│ ├─ routes/ # API-reitit (auth, questions)
│ ├─ controllers/ # Sovelluslogiikka
│ ├─ models/ # Mongoose-mallit
│ └─ server.js # Käynnistyspiste
│
├─ frontend/ # Käyttöliittymä (HTML, CSS, JS)
│
└─ README.md # Tämä tiedosto


---

## ⚙️ Teknologiat

- **Node.js + Express** — palvelin ja API  
- **MongoDB Atlas + Mongoose** — tietokanta ja tietomalli  
- **HTML / CSS / JavaScript** — käyttöliittymä  
- **JWT (JSON Web Token)** — admin-autentikointi  
- **GitHub** — versionhallinta  
- **Vercel (demo)** — julkaisualusta  

---

## 🚀 Projektin tila

✅ Suunnitteluvaihe valmis  
✅ Määrittelydokumentti laadittu  
✅ Arkkitehtuuri toteutettu  
✅ Backend toimii (CRUD + Auth + MongoDB-yhteys)  
🔄 Frontendin kehitys käynnissä  
🔜 Käyttöliittymän integrointi ja testaus  

---

## 👥 Roolit

- **Markus Prusi** – opiskelija, kehittäjä ja projektipäällikkö  
- **Kamran Waheed (TSW Group Oy)** – asiakas, toimeksiantaja  
- **Taitotalo** – koulutusorganisaatio ja arviointitaho  

---

## 🧾 Dokumentaatio

Projektin dokumentaatio löytyy `docs/`-kansiosta tai erillisistä tiedostoista:

- Projektisuunnitelma  
- Määrittelydokumentti  
- Arkkitehtuurisuunnitelma  
- Wireframet  
- Toteutusdokumentti  
- Testausraportit  
- Käyttöohjeet ja julkaisuohje  

---

## 🛠️ Kehittäjille (lyhyt ohje)

Siirry `backend`-kansioon  
   ```bash
   cd backend

Asenna riippuvuudet

npm install


Lisää .env-tiedosto seuraavalla sisällöllä:

MONGODB_URI=<MongoDB Atlas yhteysosoite>
PORT=3000
JWT_SECRET=<oma salainen avain>


Käynnistä palvelin

node server.js


Avaa selaimessa:
http://localhost:3000