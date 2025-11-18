// frontend/src/components/LoginView.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function LoginView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Kirjautuminen epäonnistui");
        return;
      }

      sessionStorage.setItem("token", data.token);

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
    <div className="login-container">
      <h1 className="title">Kirjaudu sisään</h1>

      <form onSubmit={handleLogin} className="panel">
        <input
          type="text"
          placeholder="Käyttäjätunnus"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input"
        />

        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />

        <button type="submit" className="button">
          Kirjaudu
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}

export default LoginView;
