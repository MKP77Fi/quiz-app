// frontend/src/components/PracticeView.jsx
import { useState, useEffect } from "react";
import "../index.css";

function PracticeView() {
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => console.error("Virhe ladattaessa kysymyksiä:", err));
  }, []);

  if (loading) return <p className="text-center">Ladataan kysymyksiä...</p>;
  if (questions.length === 0) return <p className="text-center">Ei kysymyksiä saatavilla.</p>;

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

  return (
    <div className="login-container">
      <div className="panel" style={{ maxWidth: "700px" }}>
        <h2 className="title">Harjoittelutila</h2>

        <h3 style={{ color: "#f2f2f2", marginBottom: "24px" }}>
          {currentQuestion.questionText}
        </h3>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {currentQuestion.options.map((opt, i) => (
            <li
              key={i}
              onClick={() => handleAnswer(opt)}
              style={{
                cursor: "pointer",
                padding: "12px 16px",
                marginBottom: "10px",
                borderRadius: "8px",
                backgroundColor: "#2a2a2a",
                color: "#f2f2f2",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#FF5733")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2a2a2a")}
            >
              {opt}
            </li>
          ))}
        </ul>

        <p
          className="feedback-text"
          style={{
            marginTop: "20px",
            fontWeight: "600",
            color: answeredCorrectly ? "#1CB1CF" : "#ff4444",
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
          <p style={{ marginTop: "20px", color: "#1CB1CF", fontWeight: "bold" }}>
            🎉 Olet suorittanut kaikki harjoituskysymykset!
          </p>
        )}
      </div>
    </div>
  );
}

export default PracticeView;
