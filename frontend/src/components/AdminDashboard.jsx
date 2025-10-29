// frontend/src/components/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const goQuestions = () => navigate("/admin/questions");
  const goUsers = () => navigate("/admin/users");
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin-valikko</h1>
      <p>Valitse hallinnoitava osio:</p>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={goQuestions} style={{ padding: "10px 16px", cursor: "pointer" }}>
          Hallinnoi kysymyksiä
        </button>
        <button onClick={goUsers} style={{ padding: "10px 16px", cursor: "pointer" }}>
          Hallinnoi käyttäjiä
        </button>
        <button onClick={logout} style={{ marginLeft: "30px", padding: "10px 16px", backgroundColor: "#d9534f", color: "white", cursor: "pointer" }}>
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
