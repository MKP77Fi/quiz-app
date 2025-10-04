// Haetaan kysymykset backendistä
fetch("http://localhost:3000/api/questions")
  .then(response => response.json())
  .then(data => {
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
