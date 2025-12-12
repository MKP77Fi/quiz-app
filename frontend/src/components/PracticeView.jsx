// frontend/src/components/PracticeView.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PracticeView - Harjoittelutila
 * ------------------------------
 * Vastaa määrittelydokumentin lukua 5.1.
 *
 * Ominaisuudet:
 * 1. Näyttää kysymykset yksitellen.
 * 2. Antaa välittömän palautteen (oikein/väärin).
 * 3. Käy läpi KOKO kysymyspankin satunnaisessa järjestyksessä.
 * 4. Ei aikarajaa.
 */
function PracticeView() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Tila vastauksen tarkistukseen
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // null, "correct", "wrong"
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Ladataan harjoituskysymykset
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        
        const res = await fetch(`${API_URL}/questions/random?amount=1000`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        });

        if (!res.ok) throw new Error("Kysymysten lataus epäonnistui.");

        const data = await res.json();
        const questionsArray = data.data || (Array.isArray(data) ? data : []);
        
        // Sekoitetaan vastausvaihtoehdot
        const processed = questionsArray.map(q => ({
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5)
        }));

        setQuestions(processed);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Virhe ladattaessa harjoitusta. Yritä myöhemmin uudelleen.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [API_URL]);

  // Käsittele vastaus
  const handleAnswer = (option) => {
    if (feedback) return;

    setSelectedOption(option);
    const currentQuestion = questions[currentIndex];

    if (option === currentQuestion.correctAnswer) {
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  // Siirry seuraavaan
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFeedback(null);
      setSelectedOption(null);
    } else {
      setFeedback("finished");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <p className="text-xl animate-pulse text-accent-turquoise font-display">Ladataan harjoitusta...</p>
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

  if (questions.length === 0) return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="panel text-center">
        <p className="mb-6">Ei kysymyksiä saatavilla.</p>
        <button onClick={() => navigate("/mode")} className="btn-cancel">Paluu</button>
      </div>
    </div>
  );

  // Nykyinen kysymys
  const currentQ = questions[currentIndex];
  const isFinished = feedback === "finished";

  return (
    <div className="flex flex-col items-center min-h-[60vh] w-full px-4 py-8">
      <div className="panel w-full max-w-2xl relative">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700/50 pb-4">
          <h2 className="text-2xl font-display uppercase tracking-wider text-accent-turquoise">
            Harjoittelu
          </h2>
          <span className="text-gray-400 font-mono text-lg">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* --- LOPETUSNÄKYMÄ --- */}
        {isFinished ? (
          <div className="text-center py-6">
            <h3 className="text-3xl font-display text-green-500 mb-6">🎉 Harjoitus suoritettu!</h3>
            <p className="text-gray-400 mb-10 text-lg">
              Olet käynyt läpi kaikki {questions.length} kysymystä. 
            </p>
            <div className="flex flex-col gap-4">
              <button onClick={() => window.location.reload()} className="btn-action">
                Aloita alusta (Sekoita pakka)
              </button>
              <button onClick={() => navigate("/mode")} className="btn-cancel">
                Paluu päävalikkoon
              </button>
            </div>
          </div>
        ) : (
          /* --- KYSYMYSNÄKYMÄ --- */
          <>
            <h3 className="text-xl md:text-2xl font-medium mb-8 leading-relaxed text-center">
              {currentQ.questionText}
            </h3>

            <div className="flex flex-col gap-4">
              {currentQ.options.map((opt, i) => {
                // Määritetään luokat dynaamisesti
                let btnClass = "";
                
                if (feedback) {
                  // VASTAUS LUKITTU (Palaute näkyvissä)
                  if (opt === currentQ.correctAnswer) {
                    // Oikea vastaus: Vihreä tausta ja reunus
                    btnClass = "shape-base border-2 bg-green-600/20 border-green-500 text-green-100 font-bold";
                  } else if (feedback === "wrong" && selectedOption === opt) {
                    // Väärä valinta: Punainen tausta ja reunus
                    btnClass = "shape-base border-2 bg-red-600/20 border-red-500 text-red-100 font-bold";
                  } else {
                    // Muut vaihtoehdot: Himmennetään
                    btnClass = "btn-answer opacity-40 cursor-not-allowed hover:border-accent-turquoise hover:scale-100 hover:shadow-none hover:text-white";
                  }
                } else {
                  // NORMAALITILA: Käytetään standardia vastauspainiketta
                  btnClass = "btn-answer";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className={btnClass}
                    disabled={!!feedback}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* --- ALAPALKKI (Palaute ja Napit) --- */}
            <div className="mt-10 min-h-[100px] flex flex-col justify-end">
              
              {/* Palauteviesti */}
              <div className="mb-6 text-center h-8">
                {feedback === "correct" && (
                  <span className="text-green-400 font-bold text-xl animate-bounce-short block">
                    ✅ Oikein!
                  </span>
                )}
                {feedback === "wrong" && (
                  <span className="text-red-400 font-bold text-xl animate-shake block">
                    ❌ Väärin.
                  </span>
                )}
              </div>

              {/* Toimintopainikkeet */}
              {feedback ? (
                /* Kun vastattu: Näytä "Seuraava" */
                <button 
                  onClick={nextQuestion} 
                  className="btn-action animate-fade-in"
                >
                  Seuraava
                </button>
              ) : (
                /* Kun ei vastattu: Näytä "Keskeytä" */
                <button 
                  onClick={() => navigate("/mode")} 
                  className="btn-cancel"
                >
                  Keskeytä harjoittelu
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PracticeView;