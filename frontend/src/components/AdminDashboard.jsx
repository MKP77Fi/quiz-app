// frontend/src/components/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const goQuestions = () => navigate("/admin/questions");
  const goUsers = () => navigate("/admin/users");
  const goQuizSettings = () => navigate("/admin/quiz-settings");
  const goLogs = () => navigate("/admin/logs"); // ✅ uusi funktio
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <div className="panel" style={{ textAlign: "center" }}>
        <h1 className="title">Admin-valikko</h1>
        <p style={{ textAlign: "center" }}>Valitse hallinnoitava osio:</p>

        <div
          className="admin-buttons"
          style={{
            marginTop: "25px",
            display: "flex",
            flexDirection: "column",
            gap: "12px", // ✅ lisää ilmavuutta
            alignItems: "center",
          }}
        >
          <button className="button" onClick={goQuestions}>
            Hallinnoi kysymyksiä
          </button>
          <button className="button" onClick={goUsers}>
            Hallinnoi käyttäjiä
          </button>
          <button className="button" onClick={goQuizSettings}>
            Hallinnoi tenttiä
          </button>
          <button className="button" onClick={goLogs}>
            Näytä lokit
          </button>

          <button
            className="button button--danger"
            onClick={logout}
            style={{ marginTop: "20px" }}
          >
            Kirjaudu ulos
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
