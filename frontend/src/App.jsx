import { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Haetaan backendistä kysymykset
    fetch("http://localhost:3000/api/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Virhe haettaessa dataa:", error));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Harjoitustentti</h1>
      {questions.length > 0 ? (
        <div>
          <h3>Kysymykset</h3>
          <ul>
            {questions.map((q) => (
              <li key={q._id} style={{ marginBottom: "20px" }}>
                <h2>{q.questionText}</h2>
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Ladataan kysymyksiä...</p>
      )}
    </div>
  );
}

export default App;
