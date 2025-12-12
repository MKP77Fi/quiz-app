// frontend/src/components/AdminQuizSettings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AdminQuizSettings - Tentin asetusten hallinta
 * --------------------------------------------
 * Vastaa määrittelydokumentin lukua 5.3 ja 8.4.
 * Tässä näkymässä ylläpitäjä voi määrittää:
 * 1. Kuinka monta kysymystä tentissä kysytään.
 * 2. Kuinka kauan tentti saa kestää (sekunteina).
 */
function AdminQuizSettings() {
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(300);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Haetaan nykyiset asetukset
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        };

        const res = await fetch(`${API_URL}/settings`, { headers });
        if (!res.ok) throw new Error("Virhe asetuksia ladattaessa");

        const data = await res.json();
        setNumQuestions(data.questionLimit ?? 10);
        setTimeLimit(data.timeLimit ?? 300);
      } catch (err) {
        setError("Asetusten lataus epäonnistui. Tarkista verkkoyhteys.");
      }
    };

    fetchSettings();
  }, [API_URL]);

  // Tallennus
  const handleSave = async () => {
    if (numQuestions < 1 || timeLimit < 10) {
      setError("Tarkista arvot: Kysymyksiä vähintään 1, aikaa vähintään 10s.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      };

      const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          questionLimit: Number(numQuestions),
          timeLimit: Number(timeLimit),
        }),
      });

      if (!res.ok) throw new Error("Asetusten tallennus epäonnistui.");

      const updated = await res.json();
      setNumQuestions(updated.data.questionLimit);
      setTimeLimit(updated.data.timeLimit);

      setMessage("✅ Asetukset tallennettu onnistuneesti!");
      setError("");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError("Tallennus epäonnistui. Yritä myöhemmin uudelleen.");
      setMessage("");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min ${seconds % 60} s`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      {/* Käytetään yhtenäistä paneelia */}
      <div className="panel w-full max-w-lg text-center">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center border-b border-gray-700/50 pb-6 mb-8 gap-6">
          <h2 className="text-3xl font-display uppercase tracking-wider text-accent-orange">
            Tenttiasetukset
          </h2>
          <button 
            onClick={() => navigate("/admin")} 
            className="btn-cancel w-full sm:w-auto"
          >
            ⬅ Paluu valikkoon
          </button>
        </div>

        {/* --- VIRHEET / ONNISTUMISET --- */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded font-bold animate-pulse">
            ⚠️ {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 bg-green-900/30 border border-green-500/50 text-green-200 rounded font-bold animate-fade-in">
            {message}
          </div>
        )}

        {/* --- LOMAKE --- */}
        <div className="flex flex-col gap-8 text-left">
          
          {/* Kysymysmäärä */}
          <div>
            <label className="block mb-2 font-bold text-gray-400 uppercase tracking-wide text-sm">
              Kysymysten määrä tentissä
            </label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              min="1"
              max="100"
              className="input-field text-center text-xl font-bold text-white bg-gray-900"
            />
            <p className="text-xs text-gray-500 mt-2 italic">
              Määrittää, montako kysymystä arvotaan pankista yhteen tenttiin.
            </p>
          </div>

          {/* Aikaraja */}
          <div>
            <label className="block mb-2 font-bold text-gray-400 uppercase tracking-wide text-sm">
              Aikaraja (sekunteina)
            </label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              min="30"
              className="input-field text-center text-xl font-bold text-white bg-gray-900"
            />
            <p className="text-sm text-accent-turquoise mt-2 font-medium text-right">
               = {formatTime(timeLimit)}
            </p>
          </div>

        </div>

        {/* --- TALLENNA --- */}
        <div className="mt-10 pt-6 border-t border-gray-700/50">
          <button onClick={handleSave} className="btn-action w-full">
            Tallenna asetukset
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminQuizSettings;