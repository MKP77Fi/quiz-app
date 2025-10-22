import { useNavigate } from "react-router-dom";

function AdminView() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Poistetaan token selaimesta
    sessionStorage.removeItem("token");

    // Siirrytään takaisin kirjautumissivulle
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Admin-näkymä</h1>
      <p>Tervetuloa, ylläpitäjä!</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Kirjaudu ulos
      </button>
    </div>
  );
}

export default AdminView;
