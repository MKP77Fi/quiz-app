import { useState } from "react";
import PracticeView from "./components/PracticeView";
import QuizView from "./components/QuizView";

function App() {
  const [mode, setMode] = useState(null); // null = ei valittu vielä

  // Jos käyttäjä ei ole vielä valinnut tilaa, näytetään valintanäkymä
  if (!mode) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
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
          onClick={() => setMode("exam")}
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

  // Näytetään valittu näkymä
  return (
    <div>
      {mode === "practice" && <PracticeView />}
      {mode === "exam" && <QuizView />}
    </div>
  );
}

export default App;
