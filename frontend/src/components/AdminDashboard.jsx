// frontend/src/components/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import "../index.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const goQuestions = () => navigate("/admin/questions");
  const goUsers = () => navigate("/admin/users");
  const goExams = () => navigate("/admin/exams"); // uusi osio tenttien hallinnalle
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <div className="panel" style={{ maxWidth: "480px" }}>
        <h1 className="title">Admin-valikko</h1>
        <p>Valitse hallinnoitava osio:</p>

        <div className="admin-buttons">
          <button onClick={goQuestions} className="button">
            Hallinnoi kysymyksiä
          </button>
          <button onClick={goUsers} className="button">
            Hallinnoi käyttäjiä
          </button>
          <button onClick={goExams} className="button">
            Hallinnoi tenttejä
          </button>
          <button onClick={logout} className="button button--danger">
            Kirjaudu ulos
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
