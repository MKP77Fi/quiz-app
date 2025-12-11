// frontend/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // Lataa Tailwind CSS:n ja globaalit tyylit

/**
 * ------------------------------------------------------------------
 * SOVELLUKSEN KÄYNNISTYS (ENTRY POINT)
 * ------------------------------------------------------------------
 * Tämä tiedosto on ensimmäinen, joka ajetaan, kun sivu ladataan selaimeen.
 * Se "kiinnittää" React-sovelluksen HTML-tiedoston elementtiin, jossa on id="root".
 */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter mahdollistaa sivujenvälisen navigoinnin ilman 
      sivun uudelleenlatausta (Single Page Application).
      Tämä on perusta luvun 8.1 sivukartalle.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);