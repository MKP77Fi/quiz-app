import { useState, useEffect } from 'react';

/**
 * RouteAnimation - Spiraalireitti logo reveal animaatio
 * 
 * Flow:
 * 1. Näyttää spiraalireittianimaation (7s)
 * 2. Tarkistaa backendin tilan samaan aikaan
 * 3a. Jos backend vastaa → skip splash, suoraan sovellukseen
 * 3b. Jos backend ei vastaa → näytä SplashScreen
 */
function RouteAnimation({ children, onAnimationComplete }) {
  const [animationPhase, setAnimationPhase] = useState('intro'); // 'intro' | 'splash' | 'ready'
  const [backendAwake, setBackendAwake] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const runAnimation = async () => {
      // Odota että DOM ja tyylit ovat täysin valmiit
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve, { once: true });
        }
      });

      // Lisäviive varmuuden vuoksi
      await new Promise(resolve => setTimeout(resolve, 200));

      // Tarkista reduced motion -asetus
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        // Skip animaatio kokonaan
        const isAwake = await checkBackend();
        setBackendAwake(isAwake);
        if (isAwake) {
          setAnimationPhase('ready');
          onAnimationComplete();
        } else {
          setAnimationPhase('splash');
        }
        return;
      }

      // Generoi spiraalireitti nyt kun kaikki on varmasti valmis
      generateSpiralPath();

      // VAIHE 1: Animaatio (7s) ja backend-tarkistus samanaikaisesti
      const [_, isAwake] = await Promise.all([
        new Promise(resolve => setTimeout(resolve, 7000)),
        checkBackend()
      ]);

      setBackendAwake(isAwake);

      // Aloita fade-out ennen siirtymää
      setFadeOut(true);

      // Odota fade-out (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));

      if (isAwake) {
        // Backend on hereillä → skip splash
        setAnimationPhase('ready');
        onAnimationComplete();
      } else {
        // Backend nukkuu → näytä splash
        setAnimationPhase('splash');
      }
    };

    runAnimation();
  }, [onAnimationComplete]);

  // Tarkista onko backend hereillä
  const checkBackend = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${apiUrl}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('Backend sleeping, will show splash screen');
      return false;
    }
  };

  // Spiraalireitin generointifunktiot
  const generateSpiralPath = () => {
    const centerX = 400;
    const centerY = 300;

    const getPoint = (angleInDegrees, radius) => {
      const angleInRadians = (angleInDegrees * Math.PI) / 180;
      return {
        x: centerX + Math.cos(angleInRadians) * radius,
        y: centerY + Math.sin(angleInRadians) * radius
      };
    };

    const getTangentVector = (angleInDegrees, length) => {
      const angleInRadians = ((angleInDegrees + 90) * Math.PI) / 180;
      return {
        x: Math.cos(angleInRadians) * length,
        y: Math.sin(angleInRadians) * length
      };
    };

    const startAngle = Math.random() * 360;
    
    const p1 = getPoint(startAngle, 700);
    const angle2 = startAngle + 80;
    const p2 = getPoint(angle2, 350);
    const angle3 = angle2 + 80;
    const p3 = getPoint(angle3, 150);
    const angle4 = angle3 + 60;
    const p4 = { x: centerX, y: centerY };

    const t1 = getTangentVector(startAngle, 200);
    const t2_in = getTangentVector(angle2, -150);
    const t2_out = getTangentVector(angle2, 150);
    const t3_in = getTangentVector(angle3, -80);
    const t3_out = getTangentVector(angle3, 80);
    const t4_in = getTangentVector(angle4, -50);

    const path = `
      M ${p1.x.toFixed(1)},${p1.y.toFixed(1)}
      C ${(p1.x + t1.x).toFixed(1)},${(p1.y + t1.y).toFixed(1)}
        ${(p2.x + t2_in.x).toFixed(1)},${(p2.y + t2_in.y).toFixed(1)}
        ${p2.x.toFixed(1)},${p2.y.toFixed(1)}
      C ${(p2.x + t2_out.x).toFixed(1)},${(p2.y + t2_out.y).toFixed(1)}
        ${(p3.x + t3_in.x).toFixed(1)},${(p3.y + t3_in.y).toFixed(1)}
        ${p3.x.toFixed(1)},${p3.y.toFixed(1)}
      C ${(p3.x + t3_out.x).toFixed(1)},${(p3.y + t3_out.y).toFixed(1)}
        ${(p4.x + t4_in.x).toFixed(1)},${(p4.y + t4_in.y).toFixed(1)}
        ${p4.x.toFixed(1)},${p4.y.toFixed(1)}
    `;

    // Päivitä SVG-polku
    const roadPath = document.getElementById('road-path');
    if (roadPath) {
      roadPath.setAttribute('d', path);
      
      // Päivitä CSS custom property autoille
      const container = document.getElementById('animation-container');
      if (container) {
        container.style.setProperty('--motion-path', `path('${path.replace(/\s+/g, ' ').trim()}')`);
      }
    }
  };

  // INTRO PHASE: Spiraalireitti animaatio
  if (animationPhase === 'intro') {
    return (
      <div 
        className="fixed inset-0 bg-[#1A1A1A] flex items-center justify-center z-50 transition-opacity duration-500"
        style={{ opacity: fadeOut ? 0 : 1 }}
      >
        <style>{`
          /* SVG Container */
          #animation-container {
            position: relative;
            width: 100%;
            height: 100%;
            max-width: 1000px;
            max-height: 800px;
          }

          #animation-container svg {
            width: 100%;
            height: 100%;
            overflow: visible;
          }

          /* Reitti */
          #road-path {
            fill: none;
            stroke: #1CB1CF;
            stroke-width: 4;
            stroke-linecap: round;
            filter: drop-shadow(0 0 5px #1CB1CF) drop-shadow(0 0 15px #1CB1CF);
            stroke-dasharray: 6000;
            stroke-dashoffset: 6000;
            animation: drawPath 7s ease-in-out forwards;
          }

          /* Auto ja haamu-autot */
          .car-group {
            offset-path: var(--motion-path);
            offset-distance: 0%;
            offset-rotate: auto 0deg;
            animation: driveCar 7s ease-in-out forwards,
                       fadeOutCar 0.8s ease-in 6.5s forwards;
          }

          .ghost-car {
            opacity: 0;
            mix-blend-mode: screen;
          }

          .ghost-1 { animation-delay: 0.04s; opacity: 0.5 !important; }
          .ghost-2 { animation-delay: 0.08s; opacity: 0.35 !important; }
          .ghost-3 { animation-delay: 0.12s; opacity: 0.2 !important; }
          .ghost-4 { animation-delay: 0.16s; opacity: 0.1 !important; }

          /* Auton grafiikka */
          .car-body {
            fill: #000;
            stroke: #1CB1CF;
            stroke-width: 2;
          }

          .taillight {
            fill: #FF0000;
            filter: drop-shadow(0 0 5px #FF0000);
          }

          .headlight {
            fill: url(#lightGradient);
            opacity: 0.6;
          }

          .taxi-sign {
            fill: #FFD700;
            filter: drop-shadow(0 0 6px #FFD700);
          }

          .ghost-car .car-body { 
            stroke-width: 1; 
            stroke-opacity: 0.2; 
            fill: none; 
          }
          .ghost-car .taxi-sign { opacity: 0.4; }
          .ghost-car .headlight { opacity: 0.2; }

          /* Logo reveal */
          .logo-reveal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: revealLogo 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 6.8s forwards;
            pointer-events: none;
            z-index: 100;
          }

          .logo-reveal img {
            width: 160px;
            height: 160px;
            object-fit: contain;
            filter: drop-shadow(0 0 20px rgba(28, 177, 207, 0.6));
          }

          /* Keyframes */
          @keyframes driveCar {
            0% { offset-distance: 0%; }
            100% { offset-distance: 100%; }
          }

          @keyframes drawPath {
            0% { stroke-dashoffset: 6000; }
            100% { stroke-dashoffset: 0; }
          }

          @keyframes fadeOutCar {
            from { 
              opacity: 1; 
              transform: scale(1); 
            }
            to { 
              opacity: 0; 
              transform: scale(2); 
              filter: blur(10px); 
            }
          }

          @keyframes revealLogo {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
              filter: blur(20px);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
              filter: blur(0px);
            }
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            #road-path,
            .car-group,
            .logo-reveal {
              animation: none !important;
            }
          }
        `}</style>

        <div id="animation-container">
          <svg viewBox="0 0 800 600">
            <defs>
              <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 255, 0.9)' }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0)' }} />
              </linearGradient>
            </defs>

            {/* Reitti */}
            <path id="road-path" d="" />

            {/* Haamu-autot */}
            <g className="car-group ghost-car ghost-4">
              <use href="#car-shape" />
            </g>
            <g className="car-group ghost-car ghost-3">
              <use href="#car-shape" />
            </g>
            <g className="car-group ghost-car ghost-2">
              <use href="#car-shape" />
            </g>
            <g className="car-group ghost-car ghost-1">
              <use href="#car-shape" />
            </g>

            {/* Pääauto */}
            <g id="main-car" className="car-group">
              <g id="car-shape">
                {/* Ajovalot */}
                <path d="M 20,-10 L 140,-40 L 140,10 Z" fill="url(#lightGradient)" opacity="0.3" />
                <path d="M 20,10 L 140,-10 L 140,40 Z" fill="url(#lightGradient)" opacity="0.3" />
                
                {/* Runko */}
                <rect x="-20" y="-15" width="45" height="30" rx="5" className="car-body" />
                
                {/* Tuulilasi */}
                <rect x="5" y="-12" width="5" height="24" fill="#1CB1CF" opacity="0.3" />
                
                {/* Takavalot */}
                <rect x="-22" y="-14" width="4" height="8" rx="1" className="taillight" />
                <rect x="-22" y="6" width="4" height="8" rx="1" className="taillight" />
                
                {/* Kyltti */}
                <rect x="-10" y="-6" width="12" height="12" rx="2" className="taxi-sign" />
              </g>
            </g>
          </svg>

          {/* Logo Reveal */}
          <div className="logo-reveal">
            <img 
              src="/src/assets/Logo.png"
              alt="Logo" 
              onLoad={() => console.log('Logo loaded successfully')}
              onError={(e) => {
                console.error('Logo lataus epäonnistui, kokeillaan vaihtoehtoista polkua');
                // Kokeile eri polkuja
                const paths = [
                  './assets/Logo.png',
                  '../assets/Logo.png',
                  '/assets/Logo.png',
                  'src/assets/Logo.png'
                ];
                
                const currentSrc = e.target.src;
                const nextPath = paths.find(p => !currentSrc.includes(p));
                
                if (nextPath) {
                  e.target.src = nextPath;
                } else {
                  // Fallback
                  e.target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.style.cssText = 'width: 160px; height: 160px; border: 3px solid #1CB1CF; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1CB1CF; font-size: 24px; font-weight: bold; background: #1A1A1A;';
                  fallback.textContent = 'LOGO';
                  e.target.parentElement.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // SPLASH PHASE: Backend nukkuu, näytetään splash - FADE IN
  if (animationPhase === 'splash') {
    return (
      <div 
        className="transition-opacity duration-500"
        style={{ opacity: 1 }}
      >
        {children}
      </div>
    );
  }

  // READY PHASE: Animaatio valmis
  return null;
}

export default RouteAnimation;