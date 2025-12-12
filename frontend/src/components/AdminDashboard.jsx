// frontend/src/components/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";

/**
 * AdminDashboard - Ylläpitäjän päävalikko
 * --------------------------------------
 * Vastaa määrittelydokumentin lukua 8.4 (Adminin näkymät).
 *
 * Tämä on keskitetty ohjausnäkymä, josta ylläpitäjä pääsee:
 * 1. Hallinnoimaan kysymyspankkia (CRUD)
 * 2. Hallinnoimaan käyttäjätunnuksia
 * 3. Muuttamaan tentin asetuksia (aika, kysymysmäärä)
 * 4. Tarkastelemaan järjestelmän teknisiä lokeja
 */
function AdminDashboard() {
  const navigate = useNavigate();

  // --- Navigaatiofunktiot ---
  const goQuestions = () => navigate("/admin/questions");
  const goUsers = () => navigate("/admin/users");
  const goQuizSettings = () => navigate("/admin/quiz-settings");
  const goLogs = () => navigate("/admin/logs");

  // --- Uloskirjautuminen ---
  // Tyhjentää istunnon (JWT-tokenin) ja ohjaa aloitussivulle.
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      {/* Käytetään yhtenäistä .panel -luokkaa */}
      <div className="panel w-full max-w-md text-center">
        
        {/* KORJATTU: Otsikon väri vaihdettu oranssiksi (text-accent-orange) */}
        <h1 className="mb-8 text-3xl font-display uppercase tracking-wider text-accent-orange">
          Admin-valikko
        </h1>
        
        <p className="text-gray-500/80 mb-8 font-medium">
          Valitse hallinnoitava osio:
        </p>

        {/* Hallintapainikkeet - Käytetään .btn-action (Turkoosi) */}
        <div className="flex flex-col gap-4 w-full">
          
          <button className="btn-action" onClick={goQuestions}>
            HALLINNOI KYSYMYKSIÄ
          </button>
          
          <button className="btn-action" onClick={goUsers}>
            HALLINNOI KÄYTTÄJIÄ
          </button>
          
          <button className="btn-action" onClick={goQuizSettings}>
            TENTIN ASETUKSET
          </button>
          
          <button className="btn-action" onClick={goLogs}>
            JÄRJESTELMÄN LOKIT
          </button>

        </div>

        {/* Erotin ja uloskirjautuminen */}
        <div className="mt-10 pt-6 border-t border-gray-700/50 w-full">
          <button
            className="btn-cancel" /* Käytetään .btn-cancel (Oranssi) */
            onClick={logout}
          >
            Kirjaudu ulos
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;