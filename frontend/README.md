📘 2. Frontend README.md – Päivitetty versio (viikko 7)
# Frontend – TSW Group: Ajolupaharjoittelu

## 🧱 Projektin rakenne
Frontend on toteutettu Reactilla ja Vite-kehitysalustalla.  
Tyylitys on toteutettu **yhtenäisellä index.css-tiedostolla**, joka sisältää globaalit värit, typografian ja komponenttipohjaiset luokat.

## 📁 Hakemistorakenne


frontend/
├─ src/
│ ├─ components/ # Sovelluksen komponentit
│ ├─ utils/ # API-kutsut ja apufunktiot
│ ├─ index.css # Keskitetty tyyli (yhteinen koko sovellukselle)
│ └─ main.jsx
├─ package.json
└─ vite.config.js


## 🎨 Käyttöliittymätyylit

Kaikki näkymät hyödyntävät globaaleja luokkia, jotka määritellään `index.css`-tiedostossa.  
Tämä takaa yhtenäisen visuaalisen ilmeen koko sovelluksessa.

### Käytettävät pääluokat
| Luokka | Käyttötarkoitus |
|--------|-----------------|
| `.panel` | Korttimainen peruspohja (login, admin jne.) |
| `.input` | Yhtenäinen tekstikenttätyyli |
| `.button` | Pääpainike (turkoosi–oranssi vaihtuva hover) |
| `.button--danger` | Punainen varoituspainike (esim. uloskirjautuminen) |
| `.title` | Näkymien pääotsikot |
| `.error-text` | Virheilmoitusten tyyli |
| `.login-container` | Login-näkymän asettelu |
| `.admin-dashboard` | Admin-etusivun asettelu |

### Väriteema
| Väri | Käyttö | HEX |
|------|--------|-----|
| Tumma tausta | Yleinen tausta | `#1A1A1A` |
| Pintaelementit | Paneelit, laatikot | `#1E1E1E` |
| Teksti (ensisijainen) | Oletustekstit | `#F2F2F2` |
| Korosteväri 1 | Oranssi (toiminnallisuus) | `#FF5733` |
| Korosteväri 2 | Turkoosi (painikkeet, valinnat) | `#1CB1CF` |

## 🧩 Komponenttien yhtenäisyys

Kaikki painikkeet, tekstikentät ja paneelit käyttävät nyt samoja luokkia, eikä komponenttikohtaisia inline-tyylejä käytetä.  
Yksilöllisiä komponenttityylejä varten voidaan luoda erillinen CSS-tiedosto `componentName.css`, joka tuodaan vain siihen näkymään.

## 🚀 Käynnistys
```bash
cd frontend
npm install
npm run dev


Frontend avautuu oletusarvoisesti osoitteeseen:
http://localhost:5173