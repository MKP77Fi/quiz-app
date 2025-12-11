// frontend/src/components/RouteAnimation.jsx
import { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';

/**
 * RouteAnimation - Lataus- ja herätysanimaatio
 * --------------------------------------------
 * Ratkaisee Render-ilmaispalvelimen "Cold Start" -ongelman (Määrittely 15.1).
 *
 * Toiminta:
 * 1. Näyttää n. 9 sekunnin animaation (taksi ajaa spiraalipolkua).
 * 2. Samalla yrittää taustalla ottaa yhteyden backendiin (herätys).
 * 3. Jos backend vastaa, siirrytään sovellukseen heti animaation jälkeen.
 * 4. Jos backend on yhä hidas, siirrytään SplashScreen-tilaan odottamaan.
 */
function RouteAnimation({ children, onAnimationComplete }) {
  const [animationPhase, setAnimationPhase] = useState('intro');

  useEffect(() => {
    const runAnimation = async () => {
      // 1. Odotetaan, että sivu on latautunut kokonaan
      await new Promise(resolve => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve, { once: true });
      });

      // 2. Esteettömyys: Jos käyttäjä ei halua liikettä, ohitetaan animaatio
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (await checkBackend()) {
          setAnimationPhase('ready');
          onAnimationComplete();
        } else {
          setAnimationPhase('splash');
        }
        return;
      }

      // 3. Generoidaan satunnainen ajoreitti (SVG Path)
      generateSpiralPath();

      // 4. Suoritetaan animaatio ja herätys rinnakkain
      const ANIMATION_DURATION = 9600; // ms
      
      const [_, isAwake] = await Promise.all([
        new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION)), 
        checkBackend() 
      ]);

      if (isAwake) {
        // Backend heräsi ajoissa -> sovellukseen
        setAnimationPhase('ready');
        onAnimationComplete();
      } else {
        // Backend nukkuu yhä -> odotusruutuun
        setAnimationPhase('splash');
      }
    };

    runAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAnimationComplete]);

  // Yrittää ottaa yhteyden backendiin
  const checkBackend = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (!apiUrl) {
      console.warn('VITE_API_URL puuttuu.');
      return false;
    }

    try {
      const controller = new AbortController();
      // Annetaan backendille aikaa vastata koko animaation keston ajan (10s)
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${apiUrl}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok || response.status === 404; // 404 on myös merkki elämästä
    } catch (error) {
      return false;
    }
  };

  // --- SVG-POLUN GENERINTI (Matematiikkaa spiraalin piirtämiseen) ---
  const generateSpiralPath = () => {
    const centerX = 400;
    const centerY = 300;
    const startRadius = 800; 

    const direction = Math.random() > 0.5 ? 1 : -1;
    const startAngle = Math.random() * 360;
    const totalRotation = 180 + Math.random() * 360; 
    const steps = 3 + Math.floor(Math.random() * 3);

    const getPos = (deg, r) => ({
      x: centerX + Math.cos((deg * Math.PI) / 180) * r,
      y: centerY + Math.sin((deg * Math.PI) / 180) * r
    });

    let currentAngle = startAngle;
    let currentRadius = startRadius;
    const startPt = getPos(currentAngle, currentRadius);
    let pathString = `M ${startPt.x.toFixed(1)},${startPt.y.toFixed(1)}`;
    const anglePerStep = totalRotation / steps;
    
    for (let i = 1; i <= steps; i++) {
      const isLast = i === steps;
      const nextAngle = startAngle + (anglePerStep * i * direction);
      const radiusProgress = i / steps;
      const nextRadius = isLast ? 0 : startRadius * (1 - Math.pow(radiusProgress, 0.8));

      const pStart = getPos(currentAngle, currentRadius);
      const pEnd = isLast ? { x: centerX, y: centerY } : getPos(nextAngle, nextRadius);

      const tangentAngle1 = currentAngle + (90 * direction);
      const tangentAngle2 = nextAngle - (90 * direction);
      const segmentAngleSpanRad = (anglePerStep * Math.PI) / 180;
      
      // Bezier-käyrän kontrollipisteet
      const len1 = (currentRadius * segmentAngleSpanRad) * 0.4 * (0.8 + Math.random() * 0.6);
      const len2 = (nextRadius * segmentAngleSpanRad) * 0.4 * (0.8 + Math.random() * 0.6);
      
      const cp1 = {
        x: pStart.x + Math.cos(tangentAngle1 * Math.PI/180) * len1,
        y: pStart.y + Math.sin(tangentAngle1 * Math.PI/180) * len1
      };
      const cp2 = {
        x: pEnd.x + Math.cos(tangentAngle2 * Math.PI/180) * len2,
        y: pEnd.y + Math.sin(tangentAngle2 * Math.PI/180) * len2
      };

      pathString += ` C ${cp1.x.toFixed(1)},${cp1.y.toFixed(1)} ${cp2.x.toFixed(1)},${cp2.y.toFixed(1)} ${pEnd.x.toFixed(1)},${pEnd.y.toFixed(1)}`;
      currentAngle = nextAngle;
      currentRadius = nextRadius;
    }

    const roadPath = document.getElementById('road-path');
    const container = document.getElementById('animation-container');
    
    if (roadPath && container) {
      roadPath.setAttribute('d', pathString);
      container.style.setProperty('--motion-path', `path('${pathString.replace(/\s+/g, ' ').trim()}')`);
    }
  };

  if (animationPhase === 'intro') {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#1A1A1A] flex items-center justify-center z-50 overflow-hidden">
        {/* CSS-TYYLIT ANIMAATIOLLE */}
        <style>{`
          #animation-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            aspect-ratio: 4/3;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #animation-container svg { width: 100%; height: 100%; overflow: visible; display: block; margin: auto; }
          
          /* Häivytys lopussa */
          .scene-content { animation: fadeOutScene 1.5s ease-in-out 7s forwards; }
          
          /* Tien piirtyminen */
          #road-path {
            fill: none; stroke: #1CB1CF; stroke-width: 4; stroke-linecap: round;
            filter: drop-shadow(0 0 5px #1CB1CF);
            stroke-dasharray: 6000; stroke-dashoffset: 6000;
            animation: drawPath 7s ease-in-out forwards;
          }

          /* Auton liike */
          .car-group {
            offset-path: var(--motion-path); offset-distance: 0%; offset-anchor: center;
            transform-origin: center; transform-box: fill-box;
            animation: driveCar 7s ease-in-out forwards;
            will-change: offset-distance, transform;
          }

          /* Haamuautot (liike-efekti) */
          .ghost-car { mix-blend-mode: screen; }
          .ghost-car .car-body { stroke-width: 1; stroke-opacity: 0.2; fill: none; }
          .ghost-1 { animation-delay: 0.04s; opacity: 0.5; }
          .ghost-2 { animation-delay: 0.08s; opacity: 0.35; }
          .ghost-3 { animation-delay: 0.12s; opacity: 0.2; }
          .ghost-4 { animation-delay: 0.16s; opacity: 0.1; }

          /* Logon ilmestyminen */
          .logo-reveal {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            opacity: 0; pointer-events: none; z-index: 100;
            animation: revealLogo 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 6.0s forwards, fadeOutLogo 0.6s ease-in 9.0s forwards;
          }
          .logo-reveal img { width: 270px; height: 270px; object-fit: contain; filter: drop-shadow(0 0 20px rgba(28, 177, 207, 0.6)); }

          /* Keyframes */
          @keyframes driveCar { to { offset-distance: 100%; } }
          @keyframes drawPath { to { stroke-dashoffset: 0; } }
          @keyframes fadeOutScene { from { opacity: 1; } to { opacity: 0; } }
          @keyframes revealLogo {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(-10deg); filter: blur(20px); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); filter: blur(0px); }
          }
          @keyframes fadeOutLogo {
            from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(1.15); filter: blur(8px); }
          }

          /* Auton värit */
          .car-body { fill: #000; stroke: #1CB1CF; stroke-width: 2; }
          .taillight { fill: #FF0000; filter: drop-shadow(0 0 5px #FF0000); }
          .taxi-sign { fill: #FFD700; filter: drop-shadow(0 0 6px #FFD700); }

          @media (prefers-reduced-motion: reduce) {
            .scene-content, .logo-reveal { animation: none !important; opacity: 1; }
          }
        `}</style>

        <div id="animation-container" aria-hidden="true">
          <svg viewBox="0 0 800 600">
            <defs>
              <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>
            </defs>

            <g className="scene-content">
              <path id="road-path" d="" />
              
              {/* Haamuautot */}
              {[4, 3, 2, 1].map(i => (
                <g key={i} className={`car-group ghost-car ghost-${i}`}>
                  <use href="#car-shape" />
                </g>
              ))}

              {/* Pääauto */}
              <g id="main-car" className="car-group">
                <g id="car-shape">
                  {/* Valokeilat */}
                  <path d="M 20,-10 L 140,-40 L 140,10 Z" fill="url(#lightGradient)" opacity="0.3" />
                  <path d="M 20,10 L 140,-10 L 140,40 Z" fill="url(#lightGradient)" opacity="0.3" />
                  {/* Kori */}
                  <rect x="-20" y="-15" width="45" height="30" rx="5" className="car-body" />
                  <rect x="5" y="-12" width="5" height="24" fill="#1CB1CF" opacity="0.3" />
                  {/* Valot */}
                  <rect x="-22" y="-14" width="4" height="8" rx="1" className="taillight" />
                  <rect x="-22" y="6" width="4" height="8" rx="1" className="taillight" />
                  {/* Taksi-kyltti */}
                  <rect x="-10" y="-6" width="12" height="12" rx="2" className="taxi-sign" />
                </g>
              </g>
            </g>
          </svg>

          <div className="logo-reveal">
            <img src={Logo} alt="" />
          </div>
        </div>
      </div>
    );
  }

  // Jos animaatio on ohi mutta backend nukkuu, näytetään SplashScreen (children)
  if (animationPhase === 'splash') {
    return (
      <div className="animate-fade-in w-full h-full">
        {children}
      </div>
    );
  }

  return null;
}

export default RouteAnimation;