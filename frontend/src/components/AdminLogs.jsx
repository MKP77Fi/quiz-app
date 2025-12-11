// frontend/src/components/AdminLogs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AdminLogs - Lokien katselunäkymä
 * --------------------------------
 * Hakee ja näyttää järjestelmän tekniset lokitiedot (virheet, kirjautumiset jne.).
 * Vastaa määrittelydokumentin lukua 8.4.
 */
function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [levelFilter, setLevelFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hakee lokitietueet backendistä
  const fetchLogs = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Istunto vanhentunut. Kirjaudu uudelleen.");
      setLoading(false);
      return; 
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/logs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Autentikointi
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP-virhe: ${res.status}`);
      }

      const data = await res.json();
      
      // Varmistetaan, että saatu data on taulukko ennen tilan päivitystä
      const logsArray = Array.isArray(data.logs) ? data.logs : [];
      setLogs(logsArray);
      
      setError("");
      setLoading(false);

    } catch (err) {
      setError(`Lokien haku epäonnistui: ${err.message}`); 
      setLoading(false);
    }
  };

  // Ladataan lokit komponentin käynnistyessä
  useEffect(() => {
    fetchLogs();
  }, []);

  // Suodatetaan lokit käyttäjän valintojen mukaan
  const filtered = Array.isArray(logs)
    ? logs.filter((log) => {
        if (levelFilter !== "all" && log.level !== levelFilter) return false;
        if (eventFilter && !log.event?.toLowerCase().includes(eventFilter.toLowerCase())) return false;
        return true;
      })
    : [];

  return (
    <div className="panel max-w-4xl mx-auto mt-10 text-center">
      <h2 className="title text-accent-turquoise mb-6">
        Järjestelmän lokit
      </h2>

      {/* --- SUODATTIMET --- */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {/* Tasosuodatin (Info/Warn/Error) */}
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="input w-40"
        >
          <option value="all">Kaikki tasot</option>
          <option value="info">Info</option>
          <option value="warn">Varoitus</option>
          <option value="error">Virhe</option>
        </select>

        {/* Tapahtumasuodatin (Tekstihaku) */}
        <input
          type="text"
          placeholder="Suodata tapahtuman mukaan..."
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="input w-60"
        />
      </div>

      {/* --- PALUUPAINIKE --- */}
      <div className="mb-8">
        <button
          className="button bg-accent-turquoise px-6 py-2"
          onClick={() => navigate("/admin")}
        >
          ⬅ Paluu päävalikkoon
        </button>
      </div>

      {/* --- VIRHEILMOITUS --- */}
      {error && (
        <p className="text-red-500 font-bold mb-4">
          {error}
        </p>
      )}

      {/* --- LOKITAULUKKO --- */}
      {loading ? (
        <p>Ladataan lokitietoja...</p>
      ) : filtered.length === 0 ? (
        <p>Ei lokitietoja hakuehdoilla.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-3">Aika</th>
                <th className="p-3">Taso</th>
                <th className="p-3">Tapahtuma</th>
                <th className="p-3">Viesti</th>
                <th className="p-3">Käyttäjä / IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log._id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                  <td className="p-3 text-sm text-gray-400">
                    {new Date(log.createdAt || log.timestamp).toLocaleString()} 
                  </td>
                  
                  {/* Värikoodattu taso */}
                  <td className={`p-3 font-medium ${
                    log.level === 'error' ? 'text-red-500' :
                    log.level === 'warn' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {log.level?.toUpperCase()}
                  </td>
                  
                  <td className="p-3">{log.event}</td>
                  <td className="p-3 text-gray-300">{log.message || "-"}</td>
                  <td className="p-3 text-sm">
                    <div className="font-semibold">{log.user?.username || log.user || "-"}</div>
                    <div className="text-gray-500 text-xs">{log.ip}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminLogs;