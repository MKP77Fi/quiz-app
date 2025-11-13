## 💻 2. `frontend/README.md`

```markdown
# 🎨 Frontend – TSW Group Ajolupaharjoittelu

React (Vite) -pohjainen käyttöliittymä, jossa käyttäjät voivat kirjautua, valita toimintatilan (harjoittelu tai tentti) ja hallita kysymyksiä tai käyttäjiä rooliensa mukaan.

---

## 🚀 Teknologia

| Osa | Kuvaus |
|------|---------|
| React (Vite) | Pääkehys käyttöliittymälle |
| TailwindCSS | Tyylittely ja layout |
| React Router DOM | Reititys näkymien välillä |
| Fetch API | Kommunikointi backendin kanssa |
| Session Storage | JWT-tokenin tallennus selaimessa |

---

## 📂 Rakenne

frontend/
├── src/
│ ├── components/
│ │ ├── LoginView.jsx
│ │ ├── ModeSelector.jsx
│ │ ├── PracticeView.jsx
│ │ ├── QuizView.jsx
│ │ ├── AdminDashboard.jsx
│ │ ├── AdminView.jsx
│ │ ├── UserManagementView.jsx
│ │ ├── AdminQuizSettings.jsx
│ │ └── AdminLogs.jsx
│ ├── utils/api.js
│ └── main.jsx

yaml
Kopioi koodi

---

## 🧠 Keskeiset näkymät

| Komponentti | Kuvaus |
|--------------|---------|
| **LoginView** | Kirjautuminen JWT-tokenilla |
| **ModeSelector** | Valinta: harjoittelu / tentti / admin |
| **PracticeView** | Näyttää heti vastauksen oikeellisuuden |
| **QuizView** | Tentti aikarajalla ja tuloskooste lopuksi |
| **AdminDashboard** | Päävalikko hallintanäkymään |
| **AdminView** | Kysymysten CRUD |
| **UserManagementView** | Käyttäjien CRUD |
| **AdminQuizSettings** | Tentin kysymysmäärän ja aikarajan hallinta |
| **AdminLogs** | Järjestelmän tapahtumien seuranta |

---

## 🔄 API-yhteys

Kaikki API-kutsut määritellään tiedostossa:
src/utils/api.js

bash
Kopioi koodi

Esimerkki:
```js
const API_URL = "http://localhost:3000/api";
fetch(`${API_URL}/questions`, { headers: getHeaders() });
🎨 Tyylit ja ulkoasu
TailwindCSS-pohjainen layout

Komponenttikohtaisia inline-tyylejä käytetään korostuksiin

Päävärit määritelty :root-muuttujissa (var(--accent-orange), var(--accent-turquoise))

🔧 Kehitystilanne
 Harjoittelu- ja tenttitilat toimivat

 Admin CRUD -näkymät

 Lokinäkymä toimii reaaliajassa

 UI-viimeistely (painikkeiden marginaalit, “Paluu”-painikkeet)

 Lopputestauksen aikaiset UX-muutokset