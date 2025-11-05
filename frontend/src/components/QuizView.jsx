// frontend/src/components/QuizView.jsx
import { useState, useEffect } from "react";
import "../index.css";

function QuizView() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

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
      setScore(score + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="login-container">
      <div className="panel" style={{ maxWidth: "700px" }}>
        <h2 className="title">Tenttitila</h2>

        {!finished ? (
          <>
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
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#1CB1CF")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#2a2a2a")}
                >
                  {opt}
                </li>
              ))}
            </ul>

            <p style={{ marginTop: "16px", fontSize: "0.95rem", color: "#ccc" }}>
              Kysymys {currentIndex + 1} / {questions.length}
            </p>
          </>
        ) : (
          <div style={{ marginTop: "24px" }}>
            <h3 className="title" style={{ color: "#1CB1CF" }}>
              Testi suoritettu!
            </h3>
            <p style={{ fontSize: "1.2rem", color: "#F2F2F2" }}>
              Pisteet:{" "}
              <span style={{ color: "#FF5733", fontWeight: "bold" }}>
                {score} / {questions.length}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizView;
