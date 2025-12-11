// frontend/src/components/LoginView.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * LoginView - Kirjautumissivu
 * ---------------------------
 * Ensimmäinen näkymä, jonka käyttäjä kohtaa (Luku 9.6).
 *
 * Toiminnallisuus:
 * 1. Ottaa vastaan tunnukset.
 * 2. Tekee POST-pyynnön backendille.
 * 3. Tallentaa JWT-tokenin istuntoon (sessionStorage).
 * 4. Ohjaa käyttäjän oikeaan näkymään roolin perusteella (Admin -> Dashboard, User -> ModeSelector).
 */
function LoginView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Lähetetään kirjautumispyyntö
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Näytetään backendin virheilmoitus tai yleinen virhe
        throw new Error(data.message || "Kirjautuminen epäonnistui");
      }

      // 1. Tallennetaan token istuntoon (Määrittely 4.3)
      sessionStorage.setItem("token", data.token);

      // 2. Ohjataan käyttäjä roolin perusteella (Määrittely 3.1 & 8.3/8.4)
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/mode"); // Harjoittelija
      }

    } catch (err) {
      console.error("Login error:", err);
      // Jos yhteys palvelimeen ei toimi (esim. backend nukkuu)
      setError(err.message === "Failed to fetch" 
        ? "Yhteysvirhe palvelimeen. Yritä hetken kuluttua uudelleen." 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      <div className="panel w-full max-w-sm text-center">
        
        <h1 className="title mb-6">Kirjaudu sisään</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Käyttäjätunnus"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input w-full text-center"
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Salasana"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input w-full text-center"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={`button w-full mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? "Kirjaudutaan..." : "Kirjaudu"}
          </button>

          {/* Virheilmoitus */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-semibold animate-pulse">
              {error}
            </div>
          )}
        </form>
        
        <p className="mt-6 text-sm text-gray-500">
          Käytä TSW Groupilta saamaasi tunnusta.
        </p>
      </div>
    </div>
  );
}

export default LoginView;