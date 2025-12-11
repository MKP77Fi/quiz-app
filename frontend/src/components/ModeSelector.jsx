// frontend/src/components/ModeSelector.jsx
import { useNavigate } from "react-router-dom";

/**
 * ModeSelector - Tilan valinta (Aloitussivu)
 * ------------------------------------------
 * Tämä on näkymä, johon harjoittelija saapuu kirjautumisen jälkeen.
 * Vastaa määrittelydokumentin lukua 8.3 (Aloitussivu).
 *
 * Toiminnallisuus:
 * 1. Tarjoaa selkeän valinnan Harjoittelun ja Tentin välillä.
 * 2. Selittää lyhyesti moodien erot (Määrittely vaatimus).
 * 3. Mahdollistaa uloskirjautumisen.
 */
function ModeSelector() {
  const navigate = useNavigate();

  const goToPractice = () => navigate("/practice");
  const goToQuiz = () => navigate("/quiz");

  const handleLogout = () => {
    // Tyhjennetään istunto (token ja muut tiedot)
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full">
      <div className="panel w-full max-w-lg text-center">
        
        <h1 className="title mb-2">Tervetuloa harjoittelemaan</h1>
        <p className="text-gray-500 mb-8">
          Valitse, haluatko harjoitella vapaasti vai suorittaa kokeen.
        </p>

        <div className="flex flex-col gap-4">
          {/* --- HARJOITTELU-PAINIKE --- */}
          <button 
            onClick={goToPractice} 
            className="group relative flex flex-col items-center justify-center p-6 bg-accent-turquoise hover:bg-opacity-90 text-white rounded-lg shadow-md transition-transform transform hover:scale-[1.02] active:scale-95"
          >
            <span className="text-2xl font-bold mb-1">Harjoittelu</span>
            <span className="text-sm opacity-90 font-medium">
              Vapaa tahti • Välitön palaute • Ei aikarajaa
            </span>
          </button>

          {/* --- TENTTI-PAINIKE --- */}
          <button 
            onClick={goToQuiz} 
            className="group relative flex flex-col items-center justify-center p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-[1.02] active:scale-95"
          >
            <span className="text-2xl font-bold mb-1">Tentti</span>
            <span className="text-sm opacity-90 font-medium">
              Koetilanne • Aikaraja • Tulokset lopuksi
            </span>
          </button>
        </div>

        {/* --- ULOSKIRJAUTUMINEN --- */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="button button--danger w-full sm:w-auto px-8"
          >
            Kirjaudu ulos
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModeSelector;