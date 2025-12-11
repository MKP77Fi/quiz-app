// frontend/src/components/QuestionForm.jsx
import { useState, useEffect } from "react";

/**
 * QuestionForm - Kysymyksen luonti- ja muokkauslomake
 * ---------------------------------------------------
 * Vastaa määrittelydokumentin lukua 5.3 (Kysymysten hallinta).
 *
 * Parannukset alkuperäiseen:
 * 1. "Oikea vastaus" valitaan listasta (estää kirjoitusvirheet).
 * 2. Lisätty "Pisteet"-kenttä (vastaa backendin mallia).
 * 3. Moderni Tailwind-ulkoasu.
 */
function QuestionForm({ onSave, editingQuestion, cancelEdit }) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [points, setPoints] = useState(1);

  // Kun "muokkaa"-tila muuttuu, päivitetään lomakkeen kentät
  useEffect(() => {
    if (editingQuestion) {
      setQuestionText(editingQuestion.questionText);
      setOptions(editingQuestion.options);
      setCorrectAnswer(editingQuestion.correctAnswer);
      setDifficulty(editingQuestion.difficulty || "medium");
      setPoints(editingQuestion.points || 1);
    } else {
      // Nollataan lomake uutta kysymystä varten
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setDifficulty("medium");
      setPoints(1);
    }
  }, [editingQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validointi: Oikean vastauksen on oltava valittu
    if (!correctAnswer || !options.includes(correctAnswer)) {
      alert("Valitse mikä vaihtoehdoista on oikea vastaus.");
      return;
    }

    const newQuestion = { 
      questionText, 
      options, 
      correctAnswer, 
      difficulty,
      points: Number(points)
    };
    
    onSave(newQuestion);
  };

  // Käsittelee yksittäisen vastausvaihtoehdon muutoksen
  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Jos muutetaan vaihtoehtoa, joka oli valittu oikeaksi, 
    // nollataan oikea vastaus sekaannusten välttämiseksi
    if (correctAnswer === options[index]) {
      setCorrectAnswer("");
    }
  };

  return (
    <div className="bg-surface border border-gray-700 p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-xl font-bold text-accent-turquoise mb-6 border-b border-gray-700 pb-2">
        {editingQuestion ? "Muokkaa kysymystä" : "Lisää uusi kysymys"}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* --- KYSYMYSTEKSTI --- */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Kysymysteksti:
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            placeholder="Kirjoita kysymys tähän..."
            className="input w-full"
          />
        </div>

        {/* --- VAIHTOEHDOT --- */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Vastausvaihtoehdot:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(e.target.value, i)}
                placeholder={`Vaihtoehto ${i + 1}`}
                required
                className="input w-full"
              />
            ))}
          </div>
        </div>

        {/* --- OIKEA VASTAUS & ASETUKSET --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800/50 p-4 rounded">
          
          {/* Oikea vastaus (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Oikea vastaus:
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
              className="input w-full bg-gray-900"
            >
              <option value="" disabled>Valitse oikea...</option>
              {options.map((opt, i) => (
                // Näytetään vain ne vaihtoehdot, joihin on kirjoitettu tekstiä
                opt && <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Vaikeustaso */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Vaikeustaso:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input w-full bg-gray-900"
            >
              <option value="easy">Helppo</option>
              <option value="medium">Keskitaso</option>
              <option value="hard">Vaikea</option>
            </select>
          </div>

          {/* Pisteet */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Pisteet:
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="input w-full bg-gray-900"
            />
          </div>
        </div>

        {/* --- PAINIKKEET --- */}
        <div className="flex gap-3 mt-2">
          <button 
            type="submit" 
            className="button flex-1 bg-green-600 hover:bg-green-500"
          >
            {editingQuestion ? "💾 Tallenna muutokset" : "➕ Lisää kysymys"}
          </button>

          {editingQuestion && (
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="button button--danger flex-none px-6"
            >
              Peruuta
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default QuestionForm;