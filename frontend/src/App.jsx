import { useState, useEffect } from "react";

function App() {
  // Tilat
  const [mode, setMode] = useState(null); // UUSI: harjoittelu/tentti/valinta
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Haetaan kysymykset backendistä
  useEffect(() => {
    fetch("http://localhost:3000/api/questions")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => console.error("Virhe haettaessa dataa:", error));
  }, []);

  // Jos data on vielä latauksessa
  if (loading) {
    return <p>Ladataan kysymyksiä...</p>;
  }

  // Jos kysymyksiä ei ole
  if (questions.length === 0) {
    return <p>Ei kysymyksiä saatavilla.</p>;
  }

  // Jos tilaa ei ole vielä valittu, näytetään valinta
  if (mode === null) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Harjoitustentti</h1>
        <p>Valitse tila:</p>
        <button
          onClick={() => setMode("practice")}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Harjoittelutila
        </button>
        <button
          onClick={() => setMode("quiz")}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Tenttitila
        </button>
      </div>
    );
  }

  // Valitaan näkyvä kysymys
  const currentQuestion = questions[currentIndex];

  // Siirtyminen seuraavaan kysymykseen
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Paluu aloitusvalikkoon
  const resetMode = () => {
    setMode(null);
    setCurrentIndex(0);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>
        {mode === "practice" ? "Harjoittelutila" : "Tenttitila"}
      </h1>

      <div style={{ marginTop: "30px" }}>
        <h2>{currentQuestion.questionText}</h2>

        <ul>
          {currentQuestion.options.map((opt, i) => (
            <li key={i}>{opt}</li>
          ))}
        </ul>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Seuraava
          </button>
        ) : (
          <p style={{ marginTop: "20px", fontWeight: "bold" }}>
            {mode === "quiz"
              ? "Tentti suoritettu!"
              : "Harjoittelu suoritettu!"}
          </p>
        )}

        <button
          onClick={resetMode}
          style={{
            display: "block",
            marginTop: "30px",
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Palaa valikkoon
        </button>
      </div>
    </div>
  );
}

export default App;
