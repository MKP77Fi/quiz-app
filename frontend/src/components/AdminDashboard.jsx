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
  // (Määrittely 4.3: Istunto päätetään client-side poistamalla token)
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="panel flex flex-col items-center text-center p-6 bg-white rounded shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Admin-valikko</h1>
        <p className="text-gray-600 mb-6">Valitse hallinnoitava osio:</p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Hallintapainikkeet */}
          <button className="button w-full" onClick={goQuestions}>
            Hallinnoi kysymyksiä
          </button>
          
          <button className="button w-full" onClick={goUsers}>
            Hallinnoi käyttäjiä
          </button>
          
          <button className="button w-full" onClick={goQuizSettings}>
            Hallinnoi tenttiä
          </button>
          
          <button className="button w-full" onClick={goLogs}>
            Näytä lokit
          </button>

          {/* Erotin ja uloskirjautuminen */}
          <div className="mt-4 pt-4 border-t border-gray-200 w-full">
            <button
              className="button button--danger w-full"
              onClick={logout}
            >
              Kirjaudu ulos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;