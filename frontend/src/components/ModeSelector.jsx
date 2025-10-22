import { useNavigate } from "react-router-dom";

function ModeSelector() {
  const navigate = useNavigate();

  // Siirtyminen harjoittelutilaan
  const goToPractice = () => {
    navigate("/practice");
  };

  // Siirtyminen tenttitilaan
  const goToQuiz = () => {
    navigate("/quiz");
  };

  // Uloskirjautuminen
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Valitse tila</h1>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={goToPractice}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Harjoittelu
        </button>

        <button
          onClick={goToQuiz}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Tentti
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
}

export default ModeSelector;
