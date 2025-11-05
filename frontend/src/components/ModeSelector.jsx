// frontend/src/components/ModeSelector.jsx
import { useNavigate } from "react-router-dom";
import "../index.css";

function ModeSelector() {
  const navigate = useNavigate();

  const goToPractice = () => navigate("/practice");
  const goToQuiz = () => navigate("/quiz");
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="panel" style={{ maxWidth: "420px" }}>
        <h1 className="title">Valitse tila</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <button onClick={goToPractice} className="button">
            Harjoittelu
          </button>
          <button onClick={goToQuiz} className="button">
            Tentti
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="button button--danger"
          style={{ marginTop: "32px" }}
        >
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
}

export default ModeSelector;
