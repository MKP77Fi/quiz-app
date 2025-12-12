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
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
        const limit = settings.questionLimit || 10;
        const questionsRes = await fetch(`${API_URL}/questions/random?amount=${limit}`, { headers });
        
        if (!questionsRes.ok) throw new Error("Kysymysten haku epäonnistui");
        
        const qData = await questionsRes.json();
        const questionsArray = qData.data || (Array.isArray(qData) ? qData : []);

        if (questionsArray.length === 0) {
          throw new Error("Kysymyspankki on tyhjä.");
        }

        // Sekoitetaan vaihtoehdot frontendissä
        const processed = questionsArray.map(q => ({
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5)
        }));

        setQuestions(processed);
        setTimeLeft(settings.timeLimit || 300);
        setLoading(false);

        // Kirjataan aloitus lokiin (fire-and-forget)
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

    // Tarkistetaan vastaus (hiljaisesti)
    if (option === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Siirrytään seuraavaan tai lopetetaan
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz(false); // Normaali lopetus
    }
  };

  // 4. LOPETUSLOGIIKKA
  const finishQuiz = (timeout = false) => {
    setFinished(true);
    
    // Audit-loki
    const token = sessionStorage.getItem("token");
    const endpoint = timeout ? "/quiz/timeout" : "/quiz/finish";
    
    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify({
        score: score,
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <p className="text-xl animate-pulse text-accent-turquoise font-display">Valmistellaan tenttiä...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="panel text-center">
        <p className="text-red-500 font-bold mb-6">{error}</p>
        <button onClick={() => navigate("/mode")} className="btn-cancel">Paluu</button>
      </div>
    </div>
  );

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col items-center min-h-[60vh] w-full px-4 py-8">
      <div className="panel w-full max-w-2xl relative">
        
        {/* --- OTSIKKO --- */}
        <h2 className="text-2xl font-display uppercase tracking-wider text-accent-turquoise text-center mb-6">
          Tenttitila
        </h2>

        {!finished ? (
          <>
            {/* --- TILANNEPALKKI (Aika ja Numero) --- */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-700/50 pb-4 text-lg font-mono">
              <span className="text-gray-400">
                Kysymys {currentIndex + 1} / {questions.length}
              </span>
              <span className={`font-bold ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-accent-orange"}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>

            {/* --- KYSYMYS --- */}
            <h3 className="text-xl md:text-2xl font-medium mb-8 leading-relaxed text-center">
              {currentQ.questionText}
            </h3>

            {/* --- VASTAUSVAIHTOEHDOT --- */}
            <div className="flex flex-col gap-4">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="btn-answer text-left" // Käytetään uutta läpinäkyvää tyyliä
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* --- KESKEYTYS --- */}
            <div className="mt-10 pt-6 border-t border-gray-800/50 flex justify-center">
              <button 
                onClick={() => navigate("/mode")} 
                className="btn-cancel w-full sm:w-auto" // Oranssi keskeytyspainike
              >
                Keskeytä tentti
              </button>
            </div>
          </>
        ) : (
          /* --- TULOSNÄKYMÄ --- */
          <div className="py-6 animate-fade-in text-center">
            <h3 className="text-3xl font-display text-accent-turquoise mb-8">
              Tentti suoritettu!
            </h3>
            
            {/* Pisteet isosti */}
            <div className="bg-background/30 rounded-2xl p-6 mb-8 border border-white/10 inline-block min-w-[200px]">
              <div className="text-5xl font-bold text-white mb-2 font-display">
                {score} / {questions.length}
              </div>
              <p className="text-gray-400 uppercase tracking-widest text-sm">pistettä</p>
            </div>

            {/* Aikailmoitus */}
            {timeLeft === 0 && (
              <div className="mb-8 p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg inline-block">
                ⏰ Aika loppui kesken!
              </div>
            )}

            <div>
              <button 
                onClick={() => navigate("/mode")} 
                className="btn-action w-full sm:w-auto px-10"
              >
                Paluu alkuvalikkoon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizView;