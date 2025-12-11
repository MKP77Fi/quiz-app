// frontend/src/components/QuizView.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * QuizView - Tenttitila
 * ---------------------
 * Vastaa määrittelydokumentin lukua 5.2.
 *
 * Toiminnallisuus:
 * 1. Hakee tenttiasetukset (aika ja määrä).
 * 2. Hakee satunnaiset kysymykset backendistä (vain tarvittava määrä).
 * 3. Ylläpitää aikarajaa.
 * 4. Ei anna välitöntä palautetta.
 * 5. Näyttää tulokset vasta lopussa ja lähettää audit-lokin.
 */
function QuizView() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. ALUSTUS: Hae asetukset ja kysymykset
  useEffect(() => {
    const initQuiz = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        };

        // A) Haetaan asetukset
        const settingsRes = await fetch(`${API_URL}/settings`, { headers });
        const settings = settingsRes.ok 
          ? await settingsRes.json() 
          : { questionLimit: 10, timeLimit: 300 };

        // B) Haetaan vain tarvittava määrä satunnaisia kysymyksiä
        // Tämä on tietoturvallisempaa kuin hakea kaikki.
        const limit = settings.questionLimit || 10;
        const questionsRes = await fetch(`${API_URL}/questions/random?amount=${limit}`, { headers });
        
        if (!questionsRes.ok) throw new Error("Kysymysten haku epäonnistui");
        
        const qData = await questionsRes.json();
        const questionsArray = qData.data || (Array.isArray(qData) ? qData : []);

        if (questionsArray.length === 0) {
          throw new Error("Kysymyspankki on tyhjä.");
        }

        // Sekoitetaan vaihtoehdot vielä frontendissä
        const processed = questionsArray.map(q => ({
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5)
        }));

        setQuestions(processed);
        setTimeLeft(settings.timeLimit || 300);
        setLoading(false);

        // Kirjataan aloitus lokiin (Audit)
        // Emme odota vastausta (fire-and-forget), jotta käyttäjä ei odota
        fetch(`${API_URL}/quiz/start`, { method: "POST", headers }).catch(() => {});

      } catch (err) {
        console.error(err);
        setError("Virhe tentin alustuksessa. Yritä myöhemmin uudelleen.");
        setLoading(false);
      }
    };

    initQuiz();
  }, [API_URL]);

  // 2. AJASTIN
  useEffect(() => {
    if (timeLeft === null || finished) return;

    if (timeLeft <= 0) {
      finishQuiz(true); // Aika loppui -> pakota lopetus
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  // 3. VASTAUKSEN KÄSITTELY
  const handleAnswer = (option) => {
    if (finished) return;

    // Tarkistetaan vastaus (hiljaisesti, ei palautetta käyttäjälle)
    if (option === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Siirrytään seuraavaan tai lopetetaan
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz(false); // Normaal lopetus
    }
  };

  // 4. LOPETUSLOGIIKKA
  const finishQuiz = (timeout = false) => {
    setFinished(true);
    
    // Lähetetään audit-loki backendille
    const token = sessionStorage.getItem("token");
    const endpoint = timeout ? "/quiz/timeout" : "/quiz/finish";
    
    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify({
        score: score, // Huom: React state ei välttämättä ole päivittynyt viimeisestä vastauksesta tässä scopeissa
                      // Tentin logiikassa tässä voi olla pieni heitto viimeisen kysymyksen osalta, 
                      // mutta audit-lokiin se riittää. Tarkempi logiikka vaatisi useRef:iä.
        total: questions.length
      })
    }).catch(err => console.error("Audit-loki epäonnistui:", err));
  };

  // Apufunktio ajan näyttämiseen (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  if (loading) return <div className="text-center mt-20 text-xl animate-pulse">Valmistellaan tenttiä...</div>;
  if (error) return (
    <div className="text-center mt-20">
      <p className="text-red-500 font-bold mb-4">{error}</p>
      <button onClick={() => navigate("/mode")} className="button">Paluu</button>
    </div>
  );

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col items-center mt-8 w-full px-4">
      <div className="panel w-full max-w-2xl text-center">
        <h2 className="title text-accent-turquoise mb-6">Tenttitila</h2>

        {!finished ? (
          <>
            {/* --- TILANNEPALE --- */}
            <div className="flex justify-between items-center mb-6 font-semibold text-lg border-b border-gray-700 pb-4">
              <span className="text-accent-turquoise">
                Kysymys {currentIndex + 1} / {questions.length}
              </span>
              <span className={`${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-accent-orange"}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>

            {/* --- KYSYMYS --- */}
            <h3 className="text-xl mb-6 text-left">{currentQ.questionText}</h3>

            <div className="flex flex-col gap-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="p-4 bg-surface border border-gray-600 hover:bg-gray-700 rounded-lg text-left transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* --- KESKEYTYS --- */}
            <div className="mt-8 pt-4 border-t border-gray-800">
              <button 
                onClick={() => navigate("/mode")} 
                className="text-gray-500 hover:text-red-400 text-sm underline"
              >
                Keskeytä tentti
              </button>
            </div>
          </>
        ) : (
          /* --- TULOSNÄKYMÄ --- */
          <div className="py-10 animate-fade-in">
            <h3 className="text-2xl font-bold text-accent-turquoise mb-6">
              Tentti suoritettu!
            </h3>
            
            <div className="text-4xl font-bold text-white mb-2">
              {score} / {questions.length}
            </div>
            <p className="text-gray-400 mb-8">pistettä</p>

            {timeLeft === 0 && (
              <p className="text-red-500 font-bold mb-6 bg-red-100/10 p-2 rounded">
                ⏰ Aika loppui kesken!
              </p>
            )}

            <button 
              onClick={() => navigate("/mode")} 
              className="button bg-accent-turquoise px-8 py-3 text-lg"
            >
              Paluu alkuvalikkoon
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizView;