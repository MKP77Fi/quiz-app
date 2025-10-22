import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Kirjautuminen epäonnistui");
        return;
      }

      // Token talteen selaimen muistiin
      sessionStorage.setItem("token", data.token);

      // Ohjaus roolin mukaan
      if (username === "admin") {
        navigate("/admin");
      } else {
        navigate("/mode");
      }
    } catch (err) {
      setError("Palvelimeen ei saada yhteyttä");
      console.error("Virhe kirjautumisessa:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Kirjautuminen</h1>
      <form onSubmit={handleLogin} style={{ display: "inline-block", marginTop: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Käyttäjätunnus"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: "8px", width: "200px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "8px", width: "200px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Kirjaudu
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
    </div>
  );
}

export default LoginView;
