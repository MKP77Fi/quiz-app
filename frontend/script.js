// frontend/src/script.js

// API_URL ympäristömuuttujasta tai fallbackiksi localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Haetaan kysymykset backendistä
fetch(`${API_URL}/questions`)
  .then(response => {
    if (!response.ok) throw new Error("Kysymysten haku epäonnistui");
    return response.json();
  })
  .then(data => {
    if (!data.length) {
      console.log("Ei kysymyksiä tietokannassa.");
      return;
    }

    // Otetaan ensimmäinen kysymys listasta
    const question = data[0];

    // Etsitään HTML:stä paikka, johon kysymys laitetaan
    const container = document.getElementById("question-container");

    // Rakennetaan kysymyksen sisältö
    let html = `<p><strong>${question.text}</strong></p>`;
    question.options.forEach(option => {
      html += `<button>${option}</button><br>`;
    });

    // Lisätään sisältö sivulle
    container.innerHTML = html;
  })
  .catch(error => {
    console.error("Virhe haettaessa kysymyksiä:", error);
  });
