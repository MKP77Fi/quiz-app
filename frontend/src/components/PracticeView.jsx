import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ uusi import

// Apufunktio listan sekoittamiseen (Fisher–Yates shuffle)
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function PracticeView() {
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const navigate = useNavigate(); // ✅ navigointi käyttöön

  useEffect(() => {
    fetch("${import.meta.env.VITE_API_URL}/questions")
      .then((res) => res.json())
      .then((data) => {
        const randomized = shuffleArray(data).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        setQuestions(randomized);
        setLoading(false);
      })
      .catch((err) => console.error("Virhe ladattaessa kysymyksiä:", err));
  }, []);

  if (loading) return <p className="text-center mt-10">Ladataan kysymyksiä...</p>;
  if (questions.length === 0) return <p className="text-center mt-10">Ei kysymyksiä saatavilla.</p>;

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (option) => {
    if (option === currentQuestion.correctAnswer) {
      setFeedback("✅ Oikein!");
      setAnsweredCorrectly(true);
    } else {
      setFeedback("❌ Väärin, yritä uudelleen.");
      setAnsweredCorrectly(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback("");
      setAnsweredCorrectly(false);
    } else {
      setFeedback("🎉 Harjoittelu suoritettu!");
    }
  };

  const handleExit = () => navigate("/mode"); // ✅ Keskeytä tai Paluu

  return (
    <div className="panel" style={{ textAlign: "center", marginTop: "40px", maxWidth: "600px" }}>
      <h2 className="title" style={{ color: "var(--accent-turquoise)" }}>Harjoittelutila</h2>

      <p style={{ marginBottom: "15px", fontWeight: "600", color: "var(--accent-turquoise)" }}>
        Kysymys {currentIndex + 1} / {questions.length}
      </p>

      <h3 style={{ marginBottom: "20px" }}>{currentQuestion.questionText}</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentQuestion.options.map((opt, i) => (
          <li
            key={i}
            onClick={() => handleAnswer(opt)}
            style={{
              cursor: "pointer",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
              backgroundColor: "#2a2a2a",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--accent-orange)")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2a2a2a")}
          >
            {opt}
          </li>
        ))}
      </ul>

      <p
        style={{
          marginTop: "20px",
          fontWeight: "600",
          color: answeredCorrectly ? "#4CAF50" : "#FF4444",
        }}
      >
        {feedback}
      </p>

      {answeredCorrectly && currentIndex < questions.length - 1 && (
        <button onClick={nextQuestion} className="button" style={{ marginTop: "20px" }}>
          Seuraava kysymys
        </button>
      )}

      {answeredCorrectly && currentIndex === questions.length - 1 && (
        <>
          <p style={{ marginTop: "20px", color: "#4CAF50", fontWeight: "bold" }}>
            🎉 Olet suorittanut kaikki harjoituskysymykset!
          </p>
          <button onClick={handleExit} className="button" style={{ marginTop: "20px" }}>
            Paluu alkuvalikkoon
          </button>
        </>
      )}

      {/* Keskeytä näkyy aina */}
      <button onClick={handleExit} className="button button--danger" style={{ marginTop: "30px" }}>
        Keskeytä
      </button>
    </div>
  );
}

export default PracticeView;
