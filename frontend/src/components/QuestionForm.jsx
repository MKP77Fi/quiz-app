// frontend/src/components/QuestionForm.jsx
import { useState, useEffect } from "react";
import "../index.css";

function QuestionForm({ onSave, editingQuestion, cancelEdit }) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    if (editingQuestion) {
      setQuestionText(editingQuestion.questionText);
      setOptions(editingQuestion.options);
      setCorrectAnswer(editingQuestion.correctAnswer);
      setDifficulty(editingQuestion.difficulty);
    } else {
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setDifficulty("easy");
    }
  }, [editingQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = { questionText, options, correctAnswer, difficulty };
    onSave(newQuestion);
  };

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="panel">
      <h3 className="title" style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
        {editingQuestion ? "Muokkaa kysymystä" : "Lisää uusi kysymys"}
      </h3>

      <label>Kysymysteksti:</label>
      <input
        type="text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        required
        className="input"
      />

      <label>Vaihtoehdot:</label>
      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          value={opt}
          onChange={(e) => handleOptionChange(e.target.value, i)}
          placeholder={`Vaihtoehto ${i + 1}`}
          required
          className="input"
        />
      ))}

      <label>Oikea vastaus:</label>
      <input
        type="text"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        required
        className="input"
      />

      <label>Vaikeustaso:</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="input"
      >
        <option value="easy">Helppo</option>
        <option value="medium">Keskitaso</option>
        <option value="hard">Vaikea</option>
      </select>

      <div className="button-group" style={{ marginTop: "15px" }}>
        <button type="submit" className="button">
          {editingQuestion ? "Tallenna muutokset" : "Lisää kysymys"}
        </button>

        {editingQuestion && (
          <button type="button" onClick={cancelEdit} className="button button--danger">
            Peruuta
          </button>
        )}
      </div>
    </form>
  );
}

export default QuestionForm;
