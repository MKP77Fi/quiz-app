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
    try {
      const res = await fetch("http://localhost:3000/api/logs");
      const data = await res.json();

      // ✅ Varmistetaan että data on taulukko
      if (Array.isArray(data)) {
        setLogs(data);
      } else if (Array.isArray(data.data)) {
        setLogs(data.data);
      } else {
        console.warn("Odottamaton vastausrakenne logeille:", data);
        setLogs([]);
      }

      setError("");
      setLoading(false);
    } catch (err) {
      console.error("Virhe logien latauksessa:", err);
      setError("Virhe logien latauksessa. Tarkista palvelinyhteys.");
      setLoading(false);
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
