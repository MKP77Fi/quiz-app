// frontend/src/components/AdminQuizSettings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AdminQuizSettings - Tentin asetusten hallinta
 * --------------------------------------------
 * Vastaa määrittelydokumentin lukua 5.3 ja 8.4.
 * * Tässä näkymässä ylläpitäjä voi määrittää:
 * 1. Kuinka monta kysymystä tentissä kysytään.
 * 2. Kuinka kauan tentti saa kestää (sekunteina).
 * * Asetukset ovat globaaleja ja vaikuttavat kaikkiin uusiin tentteihin.
 */
function AdminQuizSettings() {
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(300);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // Haetaan nykyiset asetukset tietokannasta, kun sivu latautuu
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
        
        // Päivitetään tila backendin arvoilla tai oletuksilla
        setNumQuestions(data.questionLimit ?? 10);
        setTimeLimit(data.timeLimit ?? 300);
      } catch (err) {
        setError("Asetusten lataus epäonnistui. Tarkista verkkoyhteys.");
      }
    };

    fetchSettings();
  }, [API_URL]);

  // Tallennetaan muutetut asetukset
  const handleSave = async () => {
    // UI-tason validointi
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
      
      // Varmistetaan, että UI näyttää tallennetut arvot
      setNumQuestions(updated.data.questionLimit);
      setTimeLimit(updated.data.timeLimit);

      setMessage("✅ Asetukset tallennettu onnistuneesti!");
      setError("");
      
      // Piilotetaan onnistumisviesti hetken kuluttua
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError("Tallennus epäonnistui. Yritä myöhemmin uudelleen.");
      setMessage("");
    }
  };

  // Apufunktio: Näyttää sekunnit minuutteina (käyttäjäystävällisyys)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min ${seconds % 60} s`;
  };

  return (
    <div className="panel max-w-md mx-auto mt-10 text-center">
      <h2 className="title text-accent-turquoise mb-6">
        Tenttiasetukset
      </h2>

      {/* --- VIRHEILMOITUS --- */}
      {error && (
        <p className="text-red-500 font-bold mb-4 bg-red-100 p-2 rounded">
          {error}
        </p>
      )}

      {/* --- LOMAKE --- */}
      <div className="flex flex-col gap-6 text-left">
        
        {/* Kysymysmäärä */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Kysymysten määrä tentissä:
          </label>
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            min="1"
            max="100"
            className="input w-full text-center text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Määrittää, montako kysymystä arvotaan pankista yhteen tenttiin.
          </p>
        </div>

        {/* Aikaraja */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Aikaraja (sekunteina):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              min="30"
              className="input w-full text-center text-lg"
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 font-medium text-right">
             = {formatTime(timeLimit)}
          </p>
        </div>

      </div>

      {/* --- TOIMINTOPAINIKKEET --- */}
      <div className="flex flex-col gap-3 mt-8">
        <button onClick={handleSave} className="button w-full">
          Tallenna asetukset
        </button>
        
        <button 
          onClick={() => navigate("/admin")} 
          className="button bg-gray-500 hover:bg-gray-600 w-full"
        >
          Paluu päävalikkoon
        </button>
      </div>

      {/* --- ONNISTUMISVIESTI --- */}
      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded font-bold animate-pulse">
          {message}
        </div>
      )}
    </div>
  );
}

export default AdminQuizSettings;