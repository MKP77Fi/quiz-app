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
      {/* Käytetään samaa paneelityyliä kuin kirjautumisessa */}
      <div className="panel w-full max-w-lg text-center">
        
        {/* Otsikko samoilla tyyleillä kuin LoginView:ssä */}
        <h1 className="mb-8 text-3xl font-display uppercase tracking-wider">
          Tervetuloa
        </h1>
        
        <p className="text-gray-500/80 mb-8 font-medium">
          Valitse, haluatko harjoitella vapaasti vai suorittaa kokeen.
        </p>

        <div className="flex flex-col gap-8">
          
          {/* --- HARJOITTELU --- */}
          <div>
            <button 
              onClick={goToPractice} 
              className="btn-action" // Turkoosi toimintopainike
            >
              HARJOITTELU
            </button>
            <p className="mt-3 text-sm text-gray-500">
              Vapaa tahti • Välitön palaute • Ei aikarajaa
            </p>
          </div>

          {/* --- TENTTI --- */}
          <div>
            <button 
              onClick={goToQuiz} 
              className="btn-action" // Turkoosi toimintopainike (identtinen ylläolevan kanssa)
            >
              TENTTI
            </button>
            <p className="mt-3 text-sm text-gray-500">
              Koetilanne • Aikaraja • Tulokset lopuksi
            </p>
          </div>

        </div>

        {/* --- ULOSKIRJAUTUMINEN --- */}
        <div className="mt-10 pt-6 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="btn-cancel" // Oranssi keskeytyspainike
          >
            Kirjaudu ulos
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModeSelector;