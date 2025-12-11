// frontend/src/components/AdminView.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Komponentit (Oletamme näiden tulevan seuraavaksi)
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

/**
 * AdminView - Kysymyspankin hallinta
 * ----------------------------------
 * Vastaa määrittelydokumentin lukua 5.3 (Kysymysten hallinta).
 * * Tämä näkymä yhdistää kaksi alakomponenttia:
 * 1. QuestionForm: Lomake uusien luontiin ja vanhojen muokkaukseen.
 * 2. QuestionList: Lista olemassa olevista kysymyksistä.
 */
function AdminView() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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
      // Backend palauttaa objektin { success: true, data: [...] } tai suoraan taulukon
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
    <div className="panel max-w-5xl mx-auto mt-6">
      <div className="flex flex-col gap-4">
        
        {/* Otsikko ja paluupainike */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-accent-turquoise">
            Kysymysten hallinta
          </h1>
          <button 
            className="button bg-gray-600 hover:bg-gray-500 text-sm px-4 py-2" 
            onClick={() => navigate("/admin")}
          >
            ⬅ Paluu valikkoon
          </button>
        </div>

        {/* Virheilmoitus */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded font-bold mb-4">
            {error}
          </div>
        )}

        {/* Lomake (Lisäys/Muokkaus) */}
        <div className="mb-8">
          <QuestionForm
            onSave={handleSave}
            editingQuestion={editingQuestion}
            cancelEdit={() => setEditingQuestion(null)}
          />
        </div>

        {/* Lista */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">
            Kysymyspankki ({questions.length} kpl)
          </h2>
          
          {loading ? (
            <p className="text-center text-gray-400">Ladataan kysymyksiä...</p>
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