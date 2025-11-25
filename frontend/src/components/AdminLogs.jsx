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
    // HAETAAN TOKEN SESSION STORAGE -MUISTISTA
    const token = sessionStorage.getItem("token"); // Käytetään sessionStoragea

    if (!token) {
        setError("Kirjautumista tarvitaan (Token puuttuu).");
        setLoading(false);
        return; 
    }

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logs`, {
            method: "GET",
            // TÄRKEÄ MUUTOS: Lisätään token otsikkoon (Authorization Header)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // TÄMÄ AVAIN RATKAISEE VIAN
            }
        });

        // Jos palvelin palauttaa virheen (esim. 403 Forbidden), käsitellään se
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `HTTP-virhe: ${res.status}`);
        }

        const data = await res.json();

        // TARKASTUS 1: Varmistetaan, että käytetään Backendin palauttamaa 'logs'-avainta
        // Jos logs-avain puuttuu tai ei ole taulukko, logsArray on tyhjä taulukko.
        const logsArray = Array.isArray(data.logs) ? data.logs : [];

        if (logsArray.length === 0 && data.total && data.total > 0) {
            // Lokit pitäisi olla olemassa, mutta taulukko on tyhjä – tämä voi viitata Backend-suodatukseen
            console.warn("Lokidata tyhjä tai odottamaton rakenne (oikea vastaus):", data);
        }

        // Nyt asetetaan tilaan aina vain taulukko, mikä estää {username, role} -objektin pääsyn logs-tilaan.
        setLogs(logsArray);
        setError("");
        setLoading(false);

    } catch (err) {
        console.error("Virhe logien latauksessa:", err);
        setError(`Virhe logien latauksessa: ${err.message}.`); 
        setLoading(false);
    }
};

  useEffect(() => {
    fetchLogs();
    // TARKASTUS 2: Poistetaan setInterval väliaikaisesti
    // Koska virhe voi syntyä, kun fetchLogs suoritetaan liian nopeasti uudelleen, 
    // ennen kuin edellinen kierros on valmis.
    // const interval = setInterval(fetchLogs, 5000); 
    // return () => clearInterval(interval);
  }, []);

  // TARKASTUS 3: Lisätään varmistus, että 'logs' on taulukko ENNEN filteröintiä.
  const filtered = Array.isArray(logs)
    ? logs.filter((log) => {
        if (levelFilter !== "all" && log.level !== levelFilter) return false;
        if (eventFilter && !log.event?.toLowerCase().includes(eventFilter.toLowerCase())) return false;
        return true;
      })
    : []; // Jos logs ei ole taulukko (mikä aiheuttaa virheen), käytetään tyhjää taulukkoa.

  return (
    <div className="panel" style={{ maxWidth: "900px", margin: "40px auto", textAlign: "center" }}>
      <h2
        className="title"
        style={{ color: "var(--accent-turquoise)", marginBottom: "20px" }}
      >
        Järjestelmän lokit
      </h2>

      {/* Suodattimet (sama kuin ennen) */}
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

      {/* Paluu päävalikkoon (sama kuin ennen) */}
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
                  {new Date(log.createdAt || log.timestamp).toLocaleString()} 
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
                  {log.user?.username || log.user || "-"} <br />
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