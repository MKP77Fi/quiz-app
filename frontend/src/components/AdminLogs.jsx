// frontend/src/components/AdminLogs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [levelFilter, setLevelFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchLogs = async () => {
    // HAETAAN TOKEN PAIKALLISESTA MUISTISTA
    const token = sessionStorage.getItem("token"); // Käytetään sessionStoragea

    if (!token) {
        // Jos token puuttuu kokonaan (esim. uloskirjautunut), navigoidaan kirjautumissivulle.
        setError("Kirjautumista tarvitaan (Token puuttuu).");
        setLoading(false);
        // Joskus tässä kohtaa navigoidaan /login -sivulle, mutta jätetään navigointi pois nyt.
        return; 
    }

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logs`, {
            method: "GET",
            // TÄRKEÄ MUUTOS: Lisätään token otsikkoon (Authorization Header)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <--- TÄMÄ AVAIN RATKAISEE VIAN
            }
        });

        // Jos palvelin palauttaa virheen (esim. 403 Forbidden), käsitellään se
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `HTTP-virhe: ${res.status}`);
        }

        const data = await res.json();

        // Otetaan kantaa siihen, että Backend palauttaa nyt { total, count, logs }
        // Backendin logController palauttaa { total, count, logs }
        const logsArray = Array.isArray(data.logs) ? data.logs : [];

        if (logsArray.length === 0) {
             // Jos lokit palautuvat tyhjinä (mutta ilman 403-virhettä)
             console.warn("Lokidata tyhjä tai odottamaton rakenne (oikea vastaus):", data);
        }

        setLogs(logsArray);
        setError("");
        setLoading(false);

    } catch (err) {
        console.error("Virhe logien latauksessa:", err);
        // Näytetään tarkempi virhe käyttäjälle
        setError(`Virhe logien latauksessa: ${err.message}.`); 
        setLoading(false);
        // Jos virhe on "Token puuttuu" tai "Ei oikeuksia", voimme ohjata käyttäjän kirjautumaan sisään.
    }
};

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Päivitä 5s välein
    return () => clearInterval(interval);
  }, []);

  const filtered = Array.isArray(logs)
    ? logs.filter((log) => {
        if (levelFilter !== "all" && log.level !== levelFilter) return false;
        if (eventFilter && !log.event?.toLowerCase().includes(eventFilter.toLowerCase())) return false;
        return true;
      })
    : [];

  return (
    <div className="panel" style={{ maxWidth: "900px", margin: "40px auto", textAlign: "center" }}>
      <h2
        className="title"
        style={{ color: "var(--accent-turquoise)", marginBottom: "20px" }}
      >
        Järjestelmän lokit
      </h2>

      {/* Suodattimet */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="input"
          style={{ width: "160px" }}
        >
          <option value="all">Kaikki tasot</option>
          <option value="info">Info</option>
          <option value="warn">Varoitus</option>
          <option value="error">Virhe</option>
        </select>

        <input
          type="text"
          placeholder="Suodata tapahtuman mukaan..."
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="input"
          style={{ width: "240px" }}
        />
      </div>

      {/* Paluu päävalikkoon */}
      <div style={{ marginBottom: "25px" }}>
        <button
          className="button"
          onClick={() => navigate("/admin")}
          style={{ backgroundColor: "var(--accent-turquoise)", padding: "10px 20px" }}
        >
          ⬅ Paluu päävalikkoon
        </button>
      </div>

      {error && (
        <p style={{ textAlign: "center", color: "#FF4444", fontWeight: "600" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: "center" }}>Ladataan lokitietoja...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: "center" }}>Ei lokitietoja.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            color: "var(--text-primary)",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #444" }}>
              <th style={{ padding: "10px" }}>Aika</th>
              <th style={{ padding: "10px" }}>Taso</th>
              <th style={{ padding: "10px" }}>Tapahtuma</th>
              <th style={{ padding: "10px" }}>Viesti</th>
              <th style={{ padding: "10px" }}>Käyttäjä / IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log._id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "8px", fontSize: "0.9em" }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "8px",
                    color:
                      log.level === "error"
                        ? "#FF4444"
                        : log.level === "warn"
                        ? "#FFBB33"
                        : "#00C851",
                  }}
                >
                  {log.level?.toUpperCase()}
                </td>
                <td style={{ padding: "8px" }}>{log.event}</td>
                <td style={{ padding: "8px" }}>{log.message || "-"}</td>
                <td style={{ padding: "8px" }}>
                  {log.user || "-"} <br />
                  <span style={{ color: "#888" }}>{log.ip}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminLogs;
