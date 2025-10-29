import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 uusi
import {
  fetchQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../utils/api";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function AdminView() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const navigate = useNavigate(); // 🔹 navigointikoukku

  // Hae kysymykset kun komponentti latautuu
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (error) {
      console.error("Virhe kysymysten haussa:", error);
    }
  };

  const handleSave = async (question) => {
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, question);
      } else {
        await addQuestion(question);
      }
      await loadQuestions();
      setEditingQuestion(null);
    } catch (error) {
      console.error("Tallennus epäonnistui:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Haluatko varmasti poistaa kysymyksen?")) {
      try {
        await deleteQuestion(id);
        await loadQuestions();
      } catch (error) {
        console.error("Poisto epäonnistui:", error);
      }
    }
  };

  const logout = () => {
    sessionStorage.clear(); // poistaa tokenin ja käyttäjän tiedot
    navigate("/"); // 🔹 ohjaa takaisin kirjautumissivulle
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin-näkymä</h1>
      <button
        onClick={logout}
        style={{
          backgroundColor: "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "8px 12px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Kirjaudu ulos
      </button>

      <QuestionForm
        onSave={handleSave}
        editingQuestion={editingQuestion}
        cancelEdit={() => setEditingQuestion(null)}
      />
      <QuestionList
        questions={questions}
        onEdit={setEditingQuestion}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default AdminView;
