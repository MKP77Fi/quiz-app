import { useState, useEffect } from "react";

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

  if (loading) return <p>Ladataan kysymyksiä...</p>;
  if (questions.length === 0) return <p>Ei kysymyksiä saatavilla.</p>;

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Tenttitila</h2>

      {!finished ? (
        <>
          <h3>{currentQuestion.questionText}</h3>
          <ul>
            {currentQuestion.options.map((opt, i) => (
              <li
                key={i}
                onClick={() => handleAnswer(opt)}
                style={{
                  cursor: "pointer",
                  padding: "5px",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "5px",
                  borderRadius: "5px",
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <h3>Testi suoritettu!</h3>
          <p>Pisteet: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
}

export default QuizView;
