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
      
      try {
        setStatus('Yhdistetään palvelimeen')
        
        const response = await fetch(`${apiUrl}/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        })

        if (response.ok) {
          setStatus('Valmis!')
          setProgress(100)
          
          setTimeout(() => {
            onReady()
          }, 800)
        } else {
          setStatus('Palvelin vastasi, ladataan sovellusta')
          setTimeout(() => onReady(), 1500)
        }
      } catch (error) {
        console.error('Wake-up error:', error)
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
    // Ei enää full-screen, vaan container joka sopii main-osaan
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      {/* Animoitu ikoni / spinner */}
      <div className="w-20 h-20 mb-8 relative">
        <div className="w-full h-full border-4 border-accent-turquoise/20 border-t-accent-turquoise rounded-full animate-spin" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
          🚕
        </div>
      </div>

      {/* Status-teksti */}
      <div className="text-text-primary text-lg mb-4 min-h-[30px] text-center">
        {status}{dots}
      </div>

      {/* Edistymispalkki */}
      <div className="w-full max-w-sm h-1 bg-accent-turquoise/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-turquoise transition-all duration-300 shadow-glow-turquoise"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Vinkki */}
      <p className="mt-8 text-text-primary/60 text-sm text-center max-w-md px-4">
        💡 Vinkki: Käytä harjoittelutilaa oppiaksesi ja tenttitilaa testaamaan osaamistasi!
      </p>
    </div>
  )
}

export default SplashScreen