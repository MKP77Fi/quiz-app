// frontend/src/components/AdminView.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions, addQuestion, updateQuestion, deleteQuestion } from "../utils/api";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import "../index.css";

function AdminView() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const navigate = useNavigate();

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

  const handleBack = () => navigate("/admin"); // ✅ Paluu admin-valikkoon

  return (
    <div className="admin-dashboard">
      <div className="admin-box">
        <h1 className="title">Kysymysten hallinta</h1>

        <div
          className="button-group"
          style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}
        >
          <button className="button" onClick={handleBack}>
            Paluu alkuvalikkoon
          </button>
        </div>

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
    </div>
  );
}

export default AdminView;
