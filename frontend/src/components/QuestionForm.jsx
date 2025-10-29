import { useState, useEffect } from "react";

function QuestionForm({ onSave, editingQuestion, cancelEdit }) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  // Jos muokataan kysymystä, täytetään lomake sen tiedoilla
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
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>{editingQuestion ? "Muokkaa kysymystä" : "Lisää uusi kysymys"}</h3>

      <label>Kysymysteksti:</label>
      <input
        type="text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        required
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
        />
      ))}

      <label>Oikea vastaus:</label>
      <input
        type="text"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        required
      />

      <label>Vaikeustaso:</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Helppo</option>
        <option value="medium">Keskitaso</option>
        <option value="hard">Vaikea</option>
      </select>

      <button type="submit">
        {editingQuestion ? "Tallenna muutokset" : "Lisää kysymys"}
      </button>
      {editingQuestion && (
        <button type="button" onClick={cancelEdit}>
          Peruuta
        </button>
      )}
    </form>
  );
}

export default QuestionForm;
