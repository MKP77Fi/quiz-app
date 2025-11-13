import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ uusi import

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function QuizView() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({ questionLimit: 10, timeLimit: 300 });

  const navigate = useNavigate(); // ✅ lisätty

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const [settingsRes, questionsRes] = await Promise.all([
          fetch("http://localhost:3000/api/settings"),
          fetch("http://localhost:3000/api/questions"),
        ]);

        const settingsData = settingsRes.ok
          ? await settingsRes.json()
          : { questionLimit: 10, timeLimit: 300 };

        const questionsData = await questionsRes.json();

        const randomized = shuffleArray(questionsData)
          .slice(0, settingsData.questionLimit || 10)
          .map((q) => ({ ...q, options: shuffleArray(q.options) }));

        setQuestions(randomized);
        setSettings(settingsData);
        setTimeLeft(settingsData.timeLimit || 300);
        setLoading(false);
      } catch (err) {
        console.error("Virhe ladattaessa tenttidataa:", err);
        setError("Virhe tietojen latauksessa. Yritä myöhemmin uudelleen.");
        setLoading(false);
      }
    };
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (timeLeft === null || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  const handleAnswer = (option) => {
    if (finished) return;
    if (option === questions[currentIndex].correctAnswer) setScore((p) => p + 1);
    if (currentIndex < questions.length - 1) setCurrentIndex((p) => p + 1);
    else setFinished(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleExit = () => navigate("/mode"); // ✅ yhteinen poistuminen

  if (loading) return <p className="text-center mt-10">Ladataan tenttiä...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (questions.length === 0) return <p className="text-center mt-10">Ei kysymyksiä saatavilla.</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="panel" style={{ textAlign: "center", marginTop: "40px", maxWidth: "600px" }}>
      <h2 className="title" style={{ color: "var(--accent-turquoise)" }}>Tenttitila</h2>

      {!finished && (
        <div style={{ marginBottom: "15px", fontWeight: "600" }}>
          <p style={{ color: "var(--accent-turquoise)" }}>
            Kysymys {currentIndex + 1} / {questions.length}
          </p>
          <p style={{ color: "var(--accent-orange)" }}>
            Aikaa jäljellä: {formatTime(timeLeft)}
          </p>
        </div>
      )}

      {!finished ? (
        <>
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
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "var(--accent-orange)")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#2a2a2a")}
              >
                {typeof opt === "string" ? opt : JSON.stringify(opt)}
              </li>
            ))}
          </ul>

          <button
            onClick={handleExit}
            className="button button--danger"
            style={{ marginTop: "30px" }}
          >
            Keskeytä
          </button>
        </>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "var(--accent-turquoise)", fontWeight: "bold", marginBottom: "15px" }}>
            Testi suoritettu!
          </h3>
          <p>
            Pisteet:{" "}
            <span style={{ color: "var(--accent-orange)", fontWeight: "bold" }}>
              {score} / {questions.length}
            </span>
          </p>
          {timeLeft === 0 && (
            <p style={{ color: "#FF4444", marginTop: "10px" }}>⏰ Aika loppui!</p>
          )}
          <button onClick={handleExit} className="button" style={{ marginTop: "25px" }}>
            Paluu alkuvalikkoon
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizView;
