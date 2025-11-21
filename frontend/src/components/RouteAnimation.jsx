// src/components/RouteAnimation.jsx
import { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';

/**
 * RouteAnimation - Spiraalireitti logo reveal animaatio
 */
function RouteAnimation({ children, onAnimationComplete }) {
  const [animationPhase, setAnimationPhase] = useState('intro');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const runAnimation = async () => {
      // Odota DOM
      await new Promise(resolve => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve, { once: true });
      });

      // Reduced motion check
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        const isAwake = await checkBackend();
        if (isAwake) {
          setAnimationPhase('ready');
          onAnimationComplete();
        } else {
          setAnimationPhase('splash');
        }
        return;
      }

      // Generoi polku
      generateSpiralPath();

      // VAIHE 1: Animaatio + Viive + Backend check
      // KORJAUS 3: Nostettu viive 7000ms -> 9500ms, jotta logolle jää aikaa näkyä
      const [_, isAwake] = await Promise.all([
        new Promise(resolve => setTimeout(resolve, 9500)), 
        checkBackend()
      ]);

      setFadeOut(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (isAwake) {
        setAnimationPhase('ready');
        onAnimationComplete();
      } else {
        setAnimationPhase('splash');
      }
    };

    runAnimation();

    // Resize ei enää tarvitse debouncea tai uudelleenlaskentaa niin aggressiivisesti,
    // koska käytämme SVG:n viewBox-koordinaatteja, emme pikseleitä.
    // Voimme silti pitää sen varmuuden vuoksi, jos haluamme "uuden satunnaisen reitin" koon muuttuessa.
    // Tässä versiossa se on jätetty pois turhana renderöinnin välttämiseksi, koska SVG skaalautuu CSS:llä.
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAnimationComplete]);

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
      return false;
    }
  };

  // KORJAUS 1: Käytetään aina kiinteää 800x600 koordinaatistoa laskentaan.
  // SVG:n viewBox hoitaa skaalauksen ruudulle. Tämä korjaa keskitysongelman.
  const generateSpiralPath = () => {
    const vbWidth = 800;
    const vbHeight = 600;
    const centerX = vbWidth / 2;
    const centerY = vbHeight / 2;

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
    
    // Radius arvot optimoitu 800x600 viewBoxille
    const outerRadius = 280; 
    const midRadius = 140;
    const innerRadius = 60;

    const p1 = getPoint(startAngle, outerRadius);
    const angle2 = startAngle + 100; // Hieman tiukempi kurvi
    const p2 = getPoint(angle2, midRadius);
    const angle3 = angle2 + 100;
    const p3 = getPoint(angle3, innerRadius);
    const angle4 = angle3 + 90;
    const p4 = { x: centerX, y: centerY };

    // Tangenttien pituudet hienosäädetty pehmeämmiksi
    const t1 = getTangentVector(startAngle, 100);
    const t2_in = getTangentVector(angle2, -80);
    const t2_out = getTangentVector(angle2, 80);
    const t3_in = getTangentVector(angle3, -40);
    const t3_out = getTangentVector(angle3, 40);
    const t4_in = getTangentVector(angle4, -30);

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

    const roadPath = document.getElementById('road-path');
    if (roadPath) roadPath.setAttribute('d', path);

    const container = document.getElementById('animation-container');
    if (container) {
      const trimmed = path.replace(/\s+/g, ' ').trim().replace(/'/g, "\\'");
      container.style.setProperty('--motion-path', `path('${trimmed}')`);
    }
  };

  if (animationPhase === 'intro') {
    return (
      <div
        className="fixed inset-0 bg-[#1A1A1A] flex items-center justify-center z-50 transition-opacity duration-500"
        style={{ opacity: fadeOut ? 0 : 1 }}
      >
        <style>{`
          #animation-container {
            position: relative;
            /* Containerin koko on nyt responsiivinen, mutta suhteet säilyvät */
            width: 100%; 
            max-width: 800px;
            aspect-ratio: 4/3;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          #animation-container svg {
            width: 100%;
            height: 100%;
            overflow: visible;
          }

          #road-path {
            fill: none;
            stroke: #1CB1CF;
            stroke-width: 4;
            stroke-linecap: round;
            filter: drop-shadow(0 0 5px #1CB1CF);
            stroke-dasharray: 6000;
            stroke-dashoffset: 6000;
            animation: drawPath 7s ease-in-out forwards;
          }

          /* KORJAUS 2: offset-anchor lisätty ja offset-path varmistus */
          .car-group {
            offset-path: var(--motion-path);
            offset-distance: 0%;
            offset-rotate: auto 0deg;
            /* Tärkeä: lukitsee auton keskipisteen reitille */
            offset-anchor: center; 
            transform-origin: center;
            transform-box: fill-box;
            
            animation: driveCar 7s ease-in-out forwards, fadeOutCar 0.5s ease-in 6.5s forwards;
            will-change: offset-distance, transform, opacity;
          }

          /* ... Ghost cars ... */
          .ghost-car { opacity: 0; mix-blend-mode: screen; }
          .ghost-1 { animation-delay: 0.04s; opacity: 0.5 !important; }
          .ghost-2 { animation-delay: 0.08s; opacity: 0.35 !important; }
          .ghost-3 { animation-delay: 0.12s; opacity: 0.2 !important; }
          .ghost-4 { animation-delay: 0.16s; opacity: 0.1 !important; }

          .car-body { fill: #000; stroke: #1CB1CF; stroke-width: 2; }
          .taillight { fill: #FF0000; filter: drop-shadow(0 0 5px #FF0000); }
          .headlight { fill: url(#lightGradient); opacity: 0.6; }
          .taxi-sign { fill: #FFD700; filter: drop-shadow(0 0 6px #FFD700); }

          .ghost-car .car-body { stroke-width: 1; stroke-opacity: 0.2; fill: none; }

          /* KORJAUS 3 (CSS): Logo alkaa ilmestyä aiemmin (6.0s) ja on keskellä */
          .logo-reveal {
            position: absolute;
            top: 50%;
            left: 50%;
            /* Käytetään translatea keskittämiseen varmasti */
            transform: translate(-50%, -50%);
            opacity: 0;
            /* Aloitus 6.0s (kun auto on saapumassa maaliin) */
            animation: revealLogo 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 6.0s forwards;
            pointer-events: none;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .logo-reveal img {
            width: 180px; /* Hieman isompi logo */
            height: 180px;
            object-fit: contain;
            filter: drop-shadow(0 0 20px rgba(28, 177, 207, 0.6));
          }

          @keyframes driveCar {
            0% { offset-distance: 0%; }
            100% { offset-distance: 100%; }
          }
          @keyframes drawPath {
            0% { stroke-dashoffset: 6000; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes fadeOutCar {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(2); filter: blur(10px); }
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

          @media (prefers-reduced-motion: reduce) {
            #road-path, .car-group, .logo-reveal { animation: none !important; }
          }
        `}</style>

        <div id="animation-container" aria-hidden>
          {/* ViewBox on kiinteä 800x600, CSS skaalaa tämän */}
          <svg viewBox="0 0 800 600" role="img" aria-label="Animation">
            <defs>
              <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 255, 0.9)' }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0)' }} />
              </linearGradient>
            </defs>

            <path id="road-path" d="" />

            {/* Ghost cars */}
            {[4, 3, 2, 1].map(i => (
              <g key={i} className={`car-group ghost-car ghost-${i}`}>
                <use href="#car-shape" />
              </g>
            ))}

            {/* Pääauto */}
            <g id="main-car" className="car-group">
              {/* Auton muoto on piirretty origon (0,0) ympärille */}
              <g id="car-shape">
                <path d="M 20,-10 L 140,-40 L 140,10 Z" fill="url(#lightGradient)" opacity="0.3" />
                <path d="M 20,10 L 140,-10 L 140,40 Z" fill="url(#lightGradient)" opacity="0.3" />
                <rect x="-20" y="-15" width="45" height="30" rx="5" className="car-body" />
                <rect x="5" y="-12" width="5" height="24" fill="#1CB1CF" opacity="0.3" />
                <rect x="-22" y="-14" width="4" height="8" rx="1" className="taillight" />
                <rect x="-22" y="6" width="4" height="8" rx="1" className="taillight" />
                <rect x="-10" y="-6" width="12" height="12" rx="2" className="taxi-sign" />
              </g>
            </g>
          </svg>

          <div className="logo-reveal">
            <img src={Logo} alt="Logo" onError={(e) => { e.target.style.display='none'; }} />
          </div>
        </div>
      </div>
    );
  }

  if (animationPhase === 'splash') {
    return (
      <div className="transition-opacity duration-500" style={{ opacity: 1 }}>
        {children}
      </div>
    );
  }

  return null;
}

export default RouteAnimation;