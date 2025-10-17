import { useState, useEffect } from "react";

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

  if (loading) return <p>Ladataan kysymyksiä...</p>;
  if (questions.length === 0) return <p>Ei kysymyksiä saatavilla.</p>;

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Harjoittelutila</h2>
      <h3>{currentQuestion.questionText}</h3>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {currentQuestion.options.map((opt, i) => (
          <li
            key={i}
            onClick={() => handleAnswer(opt)}
            style={{
              cursor: "pointer",
              padding: "8px",
              backgroundColor: "#f0f0f0",
              marginBottom: "6px",
              borderRadius: "5px",
              transition: "background-color 0.3s",
            }}
          >
            {opt}
          </li>
        ))}
      </ul>

      <p style={{ fontWeight: "bold", color: answeredCorrectly ? "green" : "red" }}>{feedback}</p>

      {answeredCorrectly && currentIndex < questions.length - 1 && (
        <button
          onClick={nextQuestion}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Seuraava kysymys
        </button>
      )}

      {answeredCorrectly && currentIndex === questions.length - 1 && (
        <p style={{ marginTop: "20px", fontWeight: "bold", color: "green" }}>
          🎉 Olet suorittanut kaikki harjoituskysymykset!
        </p>
      )}
    </div>
  );
}

export default PracticeView;
