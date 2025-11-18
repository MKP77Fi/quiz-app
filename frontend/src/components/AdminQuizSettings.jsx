// frontend/src/components/AdminQuizSettings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ lisätty navigointi

function AdminQuizSettings() {
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(300);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("${import.meta.env.VITE_API_URL}/settings");
        if (!res.ok) throw new Error("Virhe asetuksia ladattaessa");
        const data = await res.json();
        setNumQuestions(data.questionLimit || 10);
        setTimeLimit(data.timeLimit || 300);
      } catch (err) {
        console.error("Virhe asetusten haussa:", err);
        setError("Asetusten lataus epäonnistui.");
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionLimit: numQuestions,
          timeLimit: timeLimit,
        }),
      });

      if (!res.ok) throw new Error("Asetusten tallennus epäonnistui.");

      const updated = await res.json();
      setNumQuestions(updated.questionLimit);
      setTimeLimit(updated.timeLimit);

      setMessage("✅ Asetukset tallennettu onnistuneesti!");
      setError("");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error("Virhe tallennuksessa:", err);
      setError("Tallennus epäonnistui. Tarkista palvelinyhteys.");
      setMessage("");
    }
  };

  const handleBack = () => navigate("/admin"); // ✅ paluu adminiin

  return (
    <div
      className="panel"
      style={{ maxWidth: "480px", marginTop: "40px", textAlign: "center" }}
    >
      <h2 className="title" style={{ color: "var(--accent-turquoise)" }}>
        Tenttiasetukset
      </h2>

      {error && (
        <p style={{ color: "#FF4444", fontWeight: "600", marginBottom: "15px" }}>
          {error}
        </p>
      )}

      <label style={{ display: "block", marginBottom: "8px" }}>
        Kysymysten määrä tentissä:
      </label>
      <input
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
        min="1"
        max="100"
        className="input"
        style={{ textAlign: "center" }}
      />

      <label
        style={{ display: "block", marginTop: "20px", marginBottom: "8px" }}
      >
        Aikaraja (sekunteina):
      </label>
      <input
        type="number"
        value={timeLimit}
        onChange={(e) => setTimeLimit(Number(e.target.value))}
        min="30"
        className="input"
        style={{ textAlign: "center" }}
      />

      <div
        className="button-group"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button onClick={handleSave} className="button">
          Tallenna asetukset
        </button>
        <button onClick={handleBack} className="button button--secondary">
          Paluu alkuvalikkoon
        </button>
      </div>

      {message && (
        <p
          style={{
            color: "var(--accent-turquoise)",
            marginTop: "15px",
            fontWeight: "600",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default AdminQuizSettings;
