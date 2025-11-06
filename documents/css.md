🎨 3. CSS-dokumentointi (päivitetty)
Väripaletin muuttujat
:root {
  --background: #1A1A1A;       /* Sovelluksen päätausta */
  --surface: #1E1E1E;          /* Paneelit ja laatikot */
  --text-primary: #F2F2F2;     /* Pääteksti */
  --text-light: #FFFFFF;       /* Korostettu teksti */
  --accent-orange: #FF5733;    /* Korosteväri 1 – oranssi */
  --accent-turquoise: #1CB1CF; /* Korosteväri 2 – turkoosi */
  --border-subtle: rgba(242, 242, 242, 0.1);
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.3);
}

Typografia

Otsikot: Racing Sans One

Muu teksti: Barlow

Yleiset komponenttiluokat
.panel

Korttimainen pohja kaikille päälaatikko-osioille.

.panel {
  background-color: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
}

.input

Yhtenäinen tyyli kaikille tekstikentille.

.input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(242, 242, 242, 0.2);
  background-color: transparent;
  color: var(--accent-turquoise);
  transition: all 0.3s ease;
}
.input:focus {
  border-color: var(--accent-turquoise);
  box-shadow: 0 0 8px rgba(28, 177, 207, 0.4);
}

.button & .button--danger

Yleinen painiketyyli sekä varoitusversio.

.button {
  background-color: var(--accent-orange);
  color: var(--text-light);
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}
.button:hover {
  background-color: var(--accent-turquoise);
  transform: scale(1.03);
}
.button--danger {
  background-color: #d9534f;
}
.button--danger:hover {
  background-color: #b23b38;
}

.title

Pääotsikon yhtenäinen tyyli.

.title {
  font-family: "Racing Sans One", cursive;
  font-size: 2.2rem;
  color: var(--accent-orange);
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 87, 51, 0.3);
}

.error-text

Virheilmoitusten tyyli (esim. kirjautumisessa).

.error-text {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 10px;
}