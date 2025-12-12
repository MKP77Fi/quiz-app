// frontend/src/components/AdminView.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Komponentit
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

/**
 * AdminView - Kysymyspankin hallinta
 * ----------------------------------
 * Vastaa määrittelydokumentin lukua 5.3 (Kysymysten hallinta).
 * Tämä näkymä yhdistää kaksi alakomponenttia:
 * 1. QuestionForm: Lomake uusien luontiin ja vanhojen muokkaukseen.
 * 2. QuestionList: Lista olemassa olevista kysymyksistä.
 */
function AdminView() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Apufunktio: Hakee tokenin ja luo otsikot
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };
  };

  // 1. HAE KYSYMYKSET (READ)
  const loadQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/questions`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error("Kysymysten haku epäonnistui");

      const data = await res.json();
      setQuestions(data.data || data); 
      setError("");
    } catch (err) {
      setError("Virhe kysymysten latauksessa.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // 2. TALLENNA (CREATE / UPDATE)
  const handleSave = async (questionData) => {
    try {
      let url = `${API_URL}/questions`;
      let method = "POST";

      // Jos muokataan, lisätään ID URLiin ja vaihdetaan metodi PUTiksi
      if (editingQuestion) {
        url += `/${editingQuestion._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(questionData)
      });

      if (!res.ok) throw new Error("Tallennus epäonnistui");

      // Päivitetään lista ja nollataan muokkaustila
      await loadQuestions();
      setEditingQuestion(null);
    } catch (err) {
      setError("Tallennus epäonnistui. Tarkista tiedot.");
      console.error(err);
    }
  };

  // 3. POISTA (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän kysymyksen pysyvästi?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/questions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error("Poisto epäonnistui");

      await loadQuestions();
    } catch (err) {
      setError("Poisto epäonnistui.");
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        
        {/* --- HEADER --- */}
        {/* KORJATTU: Keskitetty asettelu (flex-col items-center) */}
        <div className="flex flex-col items-center border-b border-gray-700/50 pb-6 mb-2 gap-6">
          
          {/* KORJATTU: Otsikon väri oranssiksi */}
          <h1 className="text-3xl font-display uppercase tracking-wider text-accent-orange text-center">
            Kysymysten hallinta
          </h1>
          
          <button 
            className="btn-cancel w-full sm:w-auto" 
            onClick={() => navigate("/admin")}
          >
            ⬅ Paluu valikkoon
          </button>
        </div>

        {/* --- VIRHEILMOITUS --- */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg font-bold animate-pulse text-center">
            ⚠️ {error}
          </div>
        )}

        {/* --- LOMAKE (Lisäys/Muokkaus) --- */}
        <div>
          <QuestionForm
            onSave={handleSave}
            editingQuestion={editingQuestion}
            cancelEdit={() => setEditingQuestion(null)}
          />
        </div>

        {/* --- LISTA --- */}
        <div>
          {loading ? (
            <div className="text-center py-10">
              <p className="text-xl font-display text-accent-turquoise animate-pulse">
                Ladataan kysymyksiä...
              </p>
            </div>
          ) : (
            <QuestionList
              questions={questions}
              onEdit={setEditingQuestion} // Asettaa kysymyksen muokkaustilaan
              onDelete={handleDelete}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminView;