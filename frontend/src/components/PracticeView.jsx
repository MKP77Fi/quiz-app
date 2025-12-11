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
  const API_URL = import.meta.env.VITE_API_URL;

  // Ladataan harjoituskysymykset
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        
        // KORJAUS: Haetaan riittävän suuri määrä (esim. 1000), jotta
        // varmistetaan, että KAIKKI tietokannan kysymykset tulevat mukaan.
        // MongoDB:n $sample palauttaa maksimissaan kannassa olevan määrän
        // ilman duplikaatteja, mutta satunnaisessa järjestyksessä.
        const res = await fetch(`${API_URL}/questions/random?amount=1000`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        });

        if (!res.ok) throw new Error("Kysymysten lataus epäonnistui.");

        const data = await res.json();
        
        // Backend palauttaa { success: true, data: [...] } tai suoraan taulukon
        const questionsArray = data.data || (Array.isArray(data) ? data : []);
        
        // Sekoitetaan vielä vastausvaihtoehdot frontendissä varmuuden vuoksi,
        // jotta käyttäjä ei opi "A on aina oikein" -kaavoja.
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
    // Estetään vastaaminen uudelleen, jos palaute on jo annettu
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
      // Koko pakka on käyty läpi!
      setFeedback("finished");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <p className="text-xl animate-pulse">Ladataan harjoitusta...</p>
    </div>
  );

  if (error) return (
    <div className="text-center mt-10">
      <p className="text-red-500 font-bold mb-4">{error}</p>
      <button onClick={() => navigate("/mode")} className="button">Paluu</button>
    </div>
  );

  if (questions.length === 0) return (
    <div className="text-center mt-10">
      <p>Ei kysymyksiä saatavilla.</p>
      <button onClick={() => navigate("/mode")} className="button mt-4">Paluu</button>
    </div>
  );

  // Nykyinen kysymys
  const currentQ = questions[currentIndex];
  const isFinished = feedback === "finished";

  return (
    <div className="flex flex-col items-center mt-8 w-full px-4">
      <div className="panel w-full max-w-2xl relative">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-xl font-bold text-accent-turquoise">Harjoittelutila</h2>
          <span className="text-gray-400 font-mono">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* --- LOPETUSNÄKYMÄ --- */}
        {isFinished ? (
          <div className="text-center py-10">
            <h3 className="text-2xl font-bold text-green-500 mb-4">🎉 Harjoitus suoritettu!</h3>
            <p className="text-gray-400 mb-8">
              Olet käynyt läpi kaikki {questions.length} kysymystä. 
              Haluatko aloittaa alusta (uusi sekoitus) vai kokeilla tenttiä?
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.reload()} className="button bg-accent-turquoise">
                Aloita alusta (Sekoita pakka)
              </button>
              <button onClick={() => navigate("/mode")} className="button bg-gray-600">
                Paluu päävalikkoon
              </button>
            </div>
          </div>
        ) : (
          /* --- KYSYMYSNÄKYMÄ --- */
          <>
            <h3 className="text-lg md:text-xl font-semibold mb-6 leading-relaxed">
              {currentQ.questionText}
            </h3>

            <div className="flex flex-col gap-3">
              {currentQ.options.map((opt, i) => {
                // Dynaamiset tyylit vastauksen tilan mukaan
                let btnClass = "p-4 rounded-lg text-left transition-all border-2 ";
                
                if (feedback && opt === currentQ.correctAnswer) {
                  // Oikea vastaus näytetään aina vihreänä lopuksi
                  btnClass += "bg-green-900/30 border-green-500 text-green-100";
                } else if (feedback === "wrong" && selectedOption === opt) {
                  // Väärä valinta punaisena
                  btnClass += "bg-red-900/30 border-red-500 text-red-100";
                } else {
                  // Perustila
                  btnClass += "bg-surface border-transparent hover:bg-gray-700 cursor-pointer";
                  // Jos vastaus on lukittu, poistetaan hover ja cursor
                  if (feedback) btnClass = btnClass.replace("hover:bg-gray-700 cursor-pointer", "opacity-50 cursor-default");
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className={btnClass}
                    disabled={!!feedback} // Estä painaminen vastauksen jälkeen
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* --- PALAUTE JA JATKO --- */}
            <div className="mt-8 h-16 flex items-center justify-between">
              <div>
                {feedback === "correct" && (
                  <span className="text-green-400 font-bold text-lg animate-bounce-short">
                    ✅ Oikein!
                  </span>
                )}
                {feedback === "wrong" && (
                  <span className="text-red-400 font-bold text-lg animate-shake">
                    ❌ Väärin. Oikea oli: {currentQ.correctAnswer}
                  </span>
                )}
              </div>

              {/* Seuraava-painike ilmestyy vasta kun on vastattu */}
              {feedback && (
                <button 
                  onClick={nextQuestion} 
                  className="button bg-blue-600 hover:bg-blue-500 px-6 py-2 animate-fade-in"
                >
                  Seuraava &rarr;
                </button>
              )}
            </div>
          </>
        )}

        {/* --- KESKEYTYS --- */}
        {!isFinished && (
          <div className="mt-8 pt-4 border-t border-gray-800 text-center">
            <button 
              onClick={() => navigate("/mode")} 
              className="text-gray-500 hover:text-red-400 text-sm underline transition-colors"
            >
              Keskeytä harjoittelu
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default PracticeView;