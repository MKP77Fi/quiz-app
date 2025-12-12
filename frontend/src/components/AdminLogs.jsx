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
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP-virhe: ${res.status}`);
      }

      const data = await res.json();
      const logsArray = Array.isArray(data.logs) ? data.logs : [];
      setLogs(logsArray);
      
      setError("");
      setLoading(false);

    } catch (err) {
      setError(`Lokien haku epäonnistui: ${err.message}`); 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Suodatetaan lokit
  const filtered = Array.isArray(logs)
    ? logs.filter((log) => {
        if (levelFilter !== "all" && log.level !== levelFilter) return false;
        if (eventFilter && !log.event?.toLowerCase().includes(eventFilter.toLowerCase())) return false;
        return true;
      })
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col items-center border-b border-gray-700/50 pb-6 mb-8 gap-6">
        <h2 className="text-3xl font-display uppercase tracking-wider text-accent-orange text-center">
          Järjestelmän lokit
        </h2>
        <button
          className="btn-cancel w-full sm:w-auto"
          onClick={() => navigate("/admin")}
        >
          ⬅ Paluu valikkoon
        </button>
      </div>

      {/* --- SUODATTIMET --- */}
      <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-700/50 mb-8 flex flex-col md:flex-row justify-center gap-4 shadow-sm">
        
        {/* Tasosuodatin */}
        <div className="w-full md:w-48">
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Taso</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="input-field bg-gray-900 cursor-pointer text-sm"
          >
            <option value="all">Kaikki tasot</option>
            <option value="info">Info</option>
            <option value="warn">Varoitus</option>
            <option value="error">Virhe</option>
          </select>
        </div>

        {/* Tapahtumasuodatin */}
        <div className="w-full md:w-64">
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Haku</label>
          <input
            type="text"
            placeholder="Etsi tapahtumaa..."
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="input-field bg-gray-900 text-sm"
          />
        </div>
      </div>

      {/* --- VIRHEILMOITUS --- */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg font-bold mb-6 text-center animate-pulse">
          ⚠️ {error}
        </div>
      )}

      {/* --- LOKITAULUKKO --- */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-xl font-display text-accent-turquoise animate-pulse">
            Ladataan lokitietoja...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-900/20 rounded-xl border border-gray-800">
          <p>Ei lokitietoja hakuehdoilla.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 shadow-lg">
          <table className="w-full text-left border-collapse bg-surface">
            <thead>
              <tr className="bg-gray-900 text-accent-turquoise border-b border-gray-600">
                <th className="p-4 font-display uppercase tracking-wider text-sm">Aika</th>
                <th className="p-4 font-display uppercase tracking-wider text-sm">Taso</th>
                <th className="p-4 font-display uppercase tracking-wider text-sm">Tapahtuma</th>
                <th className="p-4 font-display uppercase tracking-wider text-sm">Viesti</th>
                <th className="p-4 font-display uppercase tracking-wider text-sm">Käyttäjä / IP</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((log) => (
                <tr key={log._id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                  
                  {/* Aika */}
                  <td className="p-4 text-gray-400 font-mono text-xs whitespace-nowrap">
                    {new Date(log.createdAt || log.timestamp).toLocaleString()} 
                  </td>
                  
                  {/* Taso (Badge-tyyli) */}
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                      log.level === 'error' ? 'bg-red-900/20 border-red-500/50 text-red-400' :
                      log.level === 'warn' ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400' :
                      'bg-blue-900/20 border-blue-500/50 text-blue-400'
                    }`}>
                      {log.level}
                    </span>
                  </td>
                  
                  {/* Tapahtuma */}
                  <td className="p-4 font-medium text-white">{log.event}</td>
                  
                  {/* Viesti */}
                  <td className="p-4 text-gray-300 max-w-xs truncate" title={log.message}>
                    {log.message || "-"}
                  </td>
                  
                  {/* Käyttäjä */}
                  <td className="p-4">
                    <div className="font-bold text-accent-turquoise">
                      {log.user?.username || (typeof log.user === 'string' ? log.user : "-")}
                    </div>
                    <div className="text-gray-500 text-xs font-mono mt-0.5">{log.ip}</div>
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