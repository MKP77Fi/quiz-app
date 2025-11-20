import { useState, useEffect } from 'react'

function SplashScreen({ onReady }) {
  const [status, setStatus] = useState('Käynnistetään sovellusta...')
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('.')

  useEffect(() => {
    // Animoi pisteet (...)
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)

    // Animoi edistymispalkki
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 300)

    // Wake up backend
    const wakeUpBackend = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const startTime = Date.now()
      
      try {
        setStatus('Yhdistetään palvelimeen')
        
        // Lähetä ping backendiin
        const response = await fetch(`${apiUrl}/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        })

        if (response.ok) {
          const elapsed = Date.now() - startTime
          setStatus('Valmis!')
          setProgress(100)
          
          // Odota vielä vähän että käyttäjä näkee "Valmis!" viestin
          setTimeout(() => {
            onReady()
          }, 800)
        } else {
          setStatus('Palvelin vastasi, ladataan sovellusta')
          setTimeout(() => onReady(), 1500)
        }
      } catch (error) {
        console.error('Wake-up error:', error)
        // Jatka silti sovellukseen virheen jälkeen
        setStatus('Ladataan sovellusta')
        setTimeout(() => onReady(), 2000)
      }
    }

    wakeUpBackend()

    return () => {
      clearInterval(dotsInterval)
      clearInterval(progressInterval)
    }
  }, [onReady])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, var(--background) 0%, #2a2a2a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      {/* Logo / Otsikko */}
      <div style={{
        marginBottom: 'var(--spacing-xl)',
        textAlign: 'center',
        animation: 'fadeInDown 0.8s ease-out'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: 'var(--spacing-sm)',
          background: 'linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-turquoise) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          TSW Ajolupakoe
        </h1>
        <p style={{
          color: 'var(--text-primary)',
          fontSize: '1.2rem',
          opacity: 0.8
        }}>
          Harjoitussovellus
        </p>
      </div>

      {/* Animoitu ikoni / spinner */}
      <div style={{
        width: '80px',
        height: '80px',
        marginBottom: 'var(--spacing-lg)',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          border: '4px solid rgba(28, 177, 207, 0.2)',
          borderTop: '4px solid var(--accent-turquoise)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2rem'
        }}>
          🚕
        </div>
      </div>

      {/* Status-teksti */}
      <div style={{
        color: 'var(--text-primary)',
        fontSize: '1.1rem',
        marginBottom: 'var(--spacing-md)',
        minHeight: '30px',
        textAlign: 'center'
      }}>
        {status}{dots}
      </div>

      {/* Edistymispalkki */}
      <div style={{
        width: '300px',
        maxWidth: '80%',
        height: '4px',
        backgroundColor: 'rgba(28, 177, 207, 0.2)',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: 'var(--accent-turquoise)',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px var(--accent-turquoise)'
        }} />
      </div>

      {/* Vinkki */}
      <p style={{
        marginTop: 'var(--spacing-lg)',
        color: 'var(--text-primary)',
        opacity: 0.6,
        fontSize: '0.9rem',
        textAlign: 'center',
        maxWidth: '400px',
        padding: '0 var(--spacing-md)'
      }}>
        💡 Vinkki: Käytä harjoittelutilaa oppiaksesi ja tenttitilaa testaamaan osaamistasi!
      </p>

      {/* CSS animaatiot */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default SplashScreen