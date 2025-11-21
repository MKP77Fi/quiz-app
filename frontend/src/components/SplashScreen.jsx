import { useState, useEffect } from 'react'

function SplashScreen({ onReady }) {
  const [status, setStatus] = useState('Käynnistetään sovellusta...')
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('.')

  useEffect(() => {
    let isMounted = true;
    
    // 1. Animoi pisteet (...)
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)

    // 2. Animoi edistymispalkki (Fiksumpi logiikka)
    // Menee hitaasti 90% asti, mutta odottaa siinä kunnes backend vastaa
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90 // Jäädään odottamaan 90% kohdalle
        // Hidastetaan vauhtia loppua kohden
        const increment = prev < 50 ? 2 : 0.5 
        return prev + increment
      })
    }, 100)

    // 3. Wake up backend (Polling / Retry logic)
    const wakeUpBackend = async () => {
      const apiUrl = import.meta.env.VITE_API_URL
      
      // Jos URL puuttuu, ei voida tehdä mitään -> sisään vaan
      if (!apiUrl) {
        setStatus('Ladataan sovellusta (Offline mode)')
        setProgress(100)
        setTimeout(() => isMounted && onReady(), 1000)
        return
      }

      const MAX_ATTEMPTS = 20; // Yritetään n. 40-50 sekuntia
      const RETRY_DELAY = 2000; // 2 sekunnin välein

      for (let i = 0; i < MAX_ATTEMPTS; i++) {
        if (!isMounted) return;

        try {
          // Päivitetään statusta vain jos kestää pitkään (yli 2 yritystä)
          if (i > 1) setStatus(`Herätellään palvelinta (yritys ${i + 1}/${MAX_ATTEMPTS})`)

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per pyyntö

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
            clearInterval(progressInterval); // Lopeta feikki-lataus
            
            // Pieni viive jotta käyttäjä näkee 100% ja viestin
            setTimeout(() => {
              if (isMounted) onReady();
            }, 800);
            return; // Lopeta loop
          }
        } catch (error) {
          // Verkkovirhe tai timeout - jatketaan looppia
          console.log(`Backend wake-up attempt ${i + 1} failed, retrying...`);
        }

        // Odota ennen seuraavaa yritystä
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }

      // Jos loop loppui ilman onnistumista (Timeout)
      if (isMounted) {
        setStatus('Palvelin ei vastaa, yritetään avata sovellus...')
        setProgress(100)
        setTimeout(() => onReady(), 1500)
      }
    }

    wakeUpBackend()

    return () => {
      isMounted = false;
      clearInterval(dotsInterval)
      clearInterval(progressInterval)
    }
  }, [onReady])

  return (
    // SCOPED WRAPPER - jyrää yli kaikki globaalit tyylit
    <div 
      className="splash-screen-wrapper"
      style={{
        display: 'flex !important',
        flexDirection: 'column !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        minHeight: '60vh !important',
        padding: '48px 16px !important',
        backgroundColor: 'var(--background, #f5f5f5) !important',
        fontFamily: 'system-ui, -apple-system, sans-serif !important',
        boxSizing: 'border-box !important'
      }}
    >
      {/* Header */}
      <div 
        className="splash-header"
        style={{
          textAlign: 'center !important',
          marginBottom: '32px !important',
          animation: 'fadeInDown 0.8s ease-out !important',
          display: 'block !important',
          width: '100% !important',
          maxWidth: '600px !important'
        }}
      >
        <h1 
          className="splash-title"
          style={{
            fontSize: '2.5rem !important',
            fontWeight: 'bold !important',
            marginBottom: '8px !important',
            margin: '0 0 8px 0 !important',
            background: 'linear-gradient(135deg, #ff6b35 0%, #1cb1cf 100%) !important',
            WebkitBackgroundClip: 'text !important',
            WebkitTextFillColor: 'transparent !important',
            backgroundClip: 'text !important',
            fontFamily: 'system-ui, -apple-system, sans-serif !important',
            lineHeight: '1.2 !important',
            padding: '0 !important'
          }}
        >
          TSW Ajolupakoe
        </h1>
        <p 
          className="splash-subtitle"
          style={{
            color: 'var(--text-primary, #333) !important',
            fontSize: '1.125rem !important',
            opacity: '0.8 !important',
            margin: '0 !important',
            fontWeight: 'normal !important'
          }}
        >
          Harjoitussovellus
        </p>
      </div>

      {/* Spinner ja sisältö */}
      <div 
        className="splash-content"
        style={{
          display: 'flex !important',
          flexDirection: 'column !important',
          alignItems: 'center !important',
          width: '100% !important',
          maxWidth: '600px !important'
        }}
      >
        {/* Animoitu ikoni / spinner */}
        <div 
          className="splash-spinner"
          style={{
            width: '80px !important',
            height: '80px !important',
            marginBottom: '32px !important',
            position: 'relative !important',
            display: 'block !important'
          }}
        >
          <div 
            className="splash-spinner-border"
            style={{
              width: '100% !important',
              height: '100% !important',
              border: '4px solid rgba(28, 177, 207, 0.2) !important',
              borderTop: '4px solid #1cb1cf !important',
              borderRadius: '50% !important',
              animation: 'spin 1s linear infinite !important',
              boxSizing: 'border-box !important'
            }}
          />
          <div 
            className="splash-spinner-emoji"
            style={{
              position: 'absolute !important',
              top: '50% !important',
              left: '50% !important',
              transform: 'translate(-50%, -50%) !important',
              fontSize: '2rem !important',
              display: 'block !important',
              margin: '0 !important',
              padding: '0 !important'
            }}
          >
            🚕
          </div>
        </div>

        {/* Status-teksti */}
        <div 
          className="splash-status"
          style={{
            color: 'var(--text-primary, #333) !important',
            fontSize: '1.125rem !important',
            marginBottom: '16px !important',
            minHeight: '30px !important',
            textAlign: 'center !important',
            display: 'block !important'
          }}
        >
          {status}{dots}
        </div>

        {/* Edistymispalkki */}
        <div 
          className="splash-progress"
          style={{
            width: '100% !important',
            maxWidth: '400px !important',
            height: '4px !important',
            backgroundColor: 'rgba(28, 177, 207, 0.2) !important',
            borderRadius: '2px !important',
            overflow: 'hidden !important',
            marginBottom: '32px !important',
            display: 'block !important'
          }}
        >
          <div 
            className="splash-progress-bar"
            style={{
              width: `${progress}% !important`,
              height: '100% !important',
              backgroundColor: '#1cb1cf !important',
              transition: 'width 0.3s ease !important',
              display: 'block !important'
            }}
          />
        </div>

        {/* Vinkki */}
        <p 
          className="splash-tip"
          style={{
            marginTop: '32px !important',
            color: 'var(--text-primary, #333) !important',
            opacity: '0.6 !important',
            fontSize: '0.875rem !important',
            textAlign: 'center !important',
            maxWidth: '400px !important',
            padding: '0 16px !important',
            marginBottom: '0 !important',
            display: 'block !important',
            fontWeight: 'normal !important',
            lineHeight: '1.5 !important'
          }}
        >
          💡 Vinkki: Jos lataus kestää, palvelin saattaa olla heräämässä unilta. Tämä voi viedä noin minuutin.
        </p>
      </div>

      {/* SCOPED CSS animaatiot */}
      <style>{`
        .splash-screen-wrapper * {
          box-sizing: border-box !important;
        }
        
        .splash-screen-wrapper .splash-spinner-border {
          animation: splash-spin 1s linear infinite !important;
        }
        
        .splash-screen-wrapper .splash-header {
          animation: splash-fadeInDown 0.8s ease-out !important;
        }
        
        @keyframes splash-spin {
          0% { transform: rotate(0deg) !important; }
          100% { transform: rotate(360deg) !important; }
        }
        
        @keyframes splash-fadeInDown {
          from {
            opacity: 0 !important;
            transform: translateY(-30px) !important;
          }
          to {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        }
        
        .splash-screen-wrapper {
          all: unset !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: 60vh !important;
          padding: 48px 16px !important;
          background-color: var(--background, #f5f5f5) !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        }
        
        .splash-screen-wrapper * {
          all: unset !important;
          display: revert !important;
          box-sizing: border-box !important;
        }
        
        .splash-screen-wrapper .splash-header {
          display: block !important;
          text-align: center !important;
          margin-bottom: 32px !important;
          animation: splash-fadeInDown 0.8s ease-out !important;
        }
        
        .splash-screen-wrapper .splash-title {
          font-size: 2.5rem !important;
          font-weight: bold !important;
          margin: 0 0 8px 0 !important;
          background: linear-gradient(135deg, #ff6b35 0%, #1cb1cf 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        
        .splash-screen-wrapper .splash-subtitle {
          color: var(--text-primary, #333) !important;
          font-size: 1.125rem !important;
          opacity: 0.8 !important;
          margin: 0 !important;
        }
        
        .splash-screen-wrapper .splash-content {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          width: 100% !important;
          max-width: 600px !important;
        }
        
        .splash-screen-wrapper .splash-spinner {
          width: 80px !important;
          height: 80px !important;
          margin-bottom: 32px !important;
          position: relative !important;
          display: block !important;
        }
        
        .splash-screen-wrapper .splash-spinner-border {
          width: 100% !important;
          height: 100% !important;
          border: 4px solid rgba(28, 177, 207, 0.2) !important;
          border-top: 4px solid #1cb1cf !important;
          border-radius: 50% !important;
          animation: splash-spin 1s linear infinite !important;
        }
        
        .splash-screen-wrapper .splash-spinner-emoji {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          font-size: 2rem !important;
        }
        
        .splash-screen-wrapper .splash-status {
          color: var(--text-primary, #333) !important;
          font-size: 1.125rem !important;
          margin-bottom: 16px !important;
          min-height: 30px !important;
          text-align: center !important;
          display: block !important;
        }
        
        .splash-screen-wrapper .splash-progress {
          width: 100% !important;
          max-width: 400px !important;
          height: 4px !important;
          background-color: rgba(28, 177, 207, 0.2) !important;
          border-radius: 2px !important;
          overflow: hidden !important;
          margin-bottom: 32px !important;
          display: block !important;
        }
        
        .splash-screen-wrapper .splash-progress-bar {
          width: ${progress}% !important;
          height: 100% !important;
          background-color: #1cb1cf !important;
          transition: width 0.3s ease !important;
          display: block !important;
        }
        
        .splash-screen-wrapper .splash-tip {
          margin-top: 32px !important;
          color: var(--text-primary, #333) !important;
          opacity: 0.6 !important;
          font-size: 0.875rem !important;
          text-align: center !important;
          max-width: 400px !important;
          padding: 0 16px !important;
          margin-bottom: 0 !important;
          display: block !important;
        }
      `}</style>
    </div>
  )
}

export default SplashScreen