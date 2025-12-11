// frontend/src/components/SplashScreen.jsx
import { useState, useEffect } from 'react';

/**
 * SplashScreen - Latausruutu (Render Cold Start)
 * ----------------------------------------------
 * Tämä komponentti näkyy VAIN, jos backend on nukkumassa (Cold Start).
 *
 * Toiminta:
 * 1. Näyttää "Ladataan..." -animaation.
 * 2. Pingaa backendia taustalla (retry loop).
 * 3. Kun backend vastaa (200 tai 404), päästää käyttäjän sisään (onReady).
 *
 * HUOMIO TYYLEISTÄ:
 * Tämä komponentti käyttää "Scoped CSS" -ratkaisua (inline styles + !important),
 * jotta se toimii täysin itsenäisesti riippumatta muun sovelluksen tai Tailwindin
 * latautumistilasta. Tämä on tarkoituksellinen valinta vakauden takaamiseksi.
 */
function SplashScreen({ onReady }) {
  const [status, setStatus] = useState('Käynnistetään sovellusta...');
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('.');

  useEffect(() => {
    let isMounted = true;
    
    // 1. Animoi pisteet (...)
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);

    // 2. Animoi edistymispalkki (Visuaalinen kikka)
    // Etenee hitaasti 90% asti, mutta pysähtyy odottamaan palvelinta.
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90; // Jäädään odottamaan
        const increment = prev < 50 ? 2 : 0.5; // Hidastuva vauhti
        return prev + increment;
      });
    }, 100);

    // 3. Herätä backend (Polling)
    const wakeUpBackend = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      if (!apiUrl) {
        // Jos URL puuttuu (esim. dev-tilassa ilman .env), päästetään läpi
        setStatus('Ladataan sovellusta...');
        setProgress(100);
        setTimeout(() => isMounted && onReady(), 1000);
        return;
      }

      const MAX_ATTEMPTS = 20; // Max n. 40 sekuntia
      const RETRY_DELAY = 2000;

      for (let i = 0; i < MAX_ATTEMPTS; i++) {
        if (!isMounted) return;

        try {
          if (i > 1) setStatus(`Herätellään palvelinta (yritys ${i + 1})...`);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch(`${apiUrl}/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          if (response.ok || response.status === 404) {
            // ONNISTUI!
            setStatus('Yhteys muodostettu!');
            setProgress(100);
            clearInterval(progressInterval);
            
            setTimeout(() => {
              if (isMounted) onReady();
            }, 800);
            return;
          }
        } catch (error) {
          // Hiljainen virhe, yritetään uudelleen
        }

        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }

      // Jos kaikki yritykset epäonnistuivat (Timeout)
      if (isMounted) {
        setStatus('Palvelin ei vastaa. Yritetään silti...');
        setProgress(100);
        setTimeout(() => onReady(), 1500);
      }
    };

    wakeUpBackend();

    return () => {
      isMounted = false;
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, [onReady]);

  return (
    <div className="splash-screen-wrapper">
      
      {/* Header */}
      <div className="splash-header">
        <h1 className="splash-title">TSW Ajolupakoe</h1>
        <p className="splash-subtitle">Harjoitussovellus</p>
      </div>

      {/* Sisältö */}
      <div className="splash-content">
        
        {/* Pyörivä taksi-ikoni */}
        <div className="splash-spinner">
          <div className="splash-spinner-border" />
          <div className="splash-spinner-emoji">🚕</div>
        </div>

        {/* Status */}
        <div className="splash-status">
          {status}{dots}
        </div>

        {/* Palkki */}
        <div className="splash-progress">
          <div className="splash-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Vinkki */}
        <p className="splash-tip">
          💡 Vinkki: Jos lataus kestää, ilmaispalvelin on heräämässä unilta. 
          Tämä voi viedä noin minuutin.
        </p>
      </div>

      {/* SCOPED CSS (Eristetyt tyylit)
        Käytetään !important varmistamaan, ettei mikään ulkoinen tyyli riko tätä näkymää.
      */}
      <style>{`
        .splash-screen-wrapper {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: 100vh !important; /* Täyttää koko ruudun */
          padding: 20px !important;
          background-color: #f5f5f5 !important;
          font-family: system-ui, -apple-system, sans-serif !important;
          color: #333 !important;
        }

        .splash-header {
          text-align: center !important;
          margin-bottom: 40px !important;
          animation: splash-fadeInDown 0.8s ease-out !important;
        }

        .splash-title {
          font-size: 2.5rem !important;
          font-weight: 800 !important;
          margin: 0 0 10px 0 !important;
          background: linear-gradient(135deg, #ff6b35 0%, #1cb1cf 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }

        .splash-subtitle {
          font-size: 1.2rem !important;
          opacity: 0.8 !important;
          margin: 0 !important;
        }

        .splash-content {
          width: 100% !important;
          max-width: 400px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        .splash-spinner {
          width: 80px !important;
          height: 80px !important;
          margin-bottom: 30px !important;
          position: relative !important;
        }

        .splash-spinner-border {
          width: 100% !important;
          height: 100% !important;
          border: 4px solid rgba(28, 177, 207, 0.2) !important;
          border-top: 4px solid #1cb1cf !important;
          border-radius: 50% !important;
          animation: splash-spin 1s linear infinite !important;
        }

        .splash-spinner-emoji {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          font-size: 2rem !important;
        }

        .splash-status {
          font-size: 1.1rem !important;
          margin-bottom: 15px !important;
          min-height: 24px !important;
          font-weight: 500 !important;
        }

        .splash-progress {
          width: 100% !important;
          height: 6px !important;
          background-color: rgba(0,0,0,0.1) !important;
          border-radius: 3px !important;
          overflow: hidden !important;
          margin-bottom: 30px !important;
        }

        .splash-progress-bar {
          height: 100% !important;
          background-color: #1cb1cf !important;
          transition: width 0.3s ease !important;
        }

        .splash-tip {
          font-size: 0.9rem !important;
          color: #666 !important;
          text-align: center !important;
          line-height: 1.5 !important;
          background: #fff !important;
          padding: 15px !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        }

        @keyframes splash-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes splash-fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;