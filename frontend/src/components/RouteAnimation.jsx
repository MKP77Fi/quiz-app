// src/components/RouteAnimation.jsx
import { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';

function RouteAnimation({ children, onAnimationComplete }) {
  const [animationPhase, setAnimationPhase] = useState('intro');

  useEffect(() => {
    const runAnimation = async () => {
      // Odota DOM
      await new Promise(resolve => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve, { once: true });
      });

      // Reduced motion check
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (await checkBackend()) {
          setAnimationPhase('ready');
          onAnimationComplete();
        } else {
          setAnimationPhase('splash');
        }
        return;
      }

      // Generoi polku
      generateSpiralPath();

      // VAIHE 1: Kokonaiskesto (ajo + logo-osuus)
      // Nostettu 9.5 sekuntiin, jotta logolla on aikaa olla yksin ruudulla
      const [_, isAwake] = await Promise.all([
        new Promise(resolve => setTimeout(resolve, 9600)), 
        checkBackend()
      ]);

      if (isAwake) {
        setAnimationPhase('ready');
        onAnimationComplete();
      } else {
        setAnimationPhase('splash');
      }
    };

    runAnimation();
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

  const generateSpiralPath = () => {
    // Käytetään SVG:n loogista kokoa 800x600 laskennassa
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
    
    // Pienennetty hieman radiusta, jotta spiraali pysyy varmasti "visuaalisesti" keskellä
    const outerRadius = 260; 
    const midRadius = 130;
    const innerRadius = 50;

    const p1 = getPoint(startAngle, outerRadius);
    const angle2 = startAngle + 100;
    const p2 = getPoint(angle2, midRadius);
    const angle3 = angle2 + 100;
    const p3 = getPoint(angle3, innerRadius);
    const angle4 = angle3 + 90;
    const p4 = { x: centerX, y: centerY };

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
      <div className="fixed inset-0 bg-[#1A1A1A] flex items-center justify-center z-50">
        <style>{`
          /* Varmistetaan, että parent flex keskittää tämän elementin */
          #animation-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            aspect-ratio: 4/3;
            /* Flex-centering varmistus */
            margin: 0 auto; 
            display: flex;
            align-items: center;
            justify-content: center;
          }

          #animation-container svg {
            width: 100%;
            height: 100%;
            /* Piilotetaan ylivuoto, jos spiraali menisi hieman yli */
            overflow: hidden; 
          }

          /* --- UUSI LOGIIKKA: Scene Fade Out --- */
          /* Tämä ryhmä sisältää tien ja autot. Se feidaantuu pois kohdassa 7s */
          .scene-content {
            animation: fadeOutScene 1s ease-in-out 7s forwards;
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

          .car-group {
            offset-path: var(--motion-path);
            offset-distance: 0%;
            offset-anchor: center;
            transform-origin: center;
            transform-box: fill-box;
            /* Auto ajaa 7s. Huom: poistettu auton oma fadeOut, koska parent (.scene-content) hoitaa sen nyt */
            animation: driveCar 7s ease-in-out forwards;
            will-change: offset-distance, transform;
          }

          /* Haamuautot */
          .ghost-car { mix-blend-mode: screen; }
          .ghost-1 { animation-delay: 0.04s; opacity: 0.5; }
          .ghost-2 { animation-delay: 0.08s; opacity: 0.35; }
          .ghost-3 { animation-delay: 0.12s; opacity: 0.2; }
          .ghost-4 { animation-delay: 0.16s; opacity: 0.1; }

          /* LOGO REVEAL & FADE OUT */
          .logo-reveal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* Tämä pitää logon keskellä */
            opacity: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            /* 1. revealLogo: Tuo logon esiin kohdassa 6.0s
               2. fadeOutLogo: Vie logon pois kohdassa 9.0s 
            */
            animation: 
              revealLogo 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 6.0s forwards,
              fadeOutLogo 0.5s ease-in 9.0s forwards;
          }

          .logo-reveal img {
            width: 270px; /* +50% isompi (oli n. 160-180px) */
            height: 270px;
            object-fit: contain;
            filter: drop-shadow(0 0 20px rgba(28, 177, 207, 0.6));
          }

          /* Keyframes */
          @keyframes driveCar {
            to { offset-distance: 100%; }
          }
          @keyframes drawPath {
            to { stroke-dashoffset: 0; }
          }
          @keyframes fadeOutScene {
            from { opacity: 1; }
            to { opacity: 0; }
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
          @keyframes fadeOutLogo {
            from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(1.1); filter: blur(10px); }
          }

          /* Osat */
          .car-body { fill: #000; stroke: #1CB1CF; stroke-width: 2; }
          .taillight { fill: #FF0000; filter: drop-shadow(0 0 5px #FF0000); }
          .headlight { fill: url(#lightGradient); opacity: 0.6; }
          .taxi-sign { fill: #FFD700; filter: drop-shadow(0 0 6px #FFD700); }
          .ghost-car .car-body { stroke-width: 1; stroke-opacity: 0.2; fill: none; }

          @media (prefers-reduced-motion: reduce) {
            .scene-content, .logo-reveal { animation: none !important; opacity: 1; }
          }
        `}</style>

        <div id="animation-container" aria-hidden>
          <svg viewBox="0 0 800 600" role="img" aria-label="Animation">
            <defs>
              <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 255, 0.9)' }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0)' }} />
              </linearGradient>
            </defs>

            {/* Ryhmitellään tie ja autot, jotta ne voidaan feidata pois yhdessä */}
            <g className="scene-content">
              <path id="road-path" d="" />

              {[4, 3, 2, 1].map(i => (
                <g key={i} className={`car-group ghost-car ghost-${i}`}>
                  <use href="#car-shape" />
                </g>
              ))}

              <g id="main-car" className="car-group">
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
            </g>
          </svg>

          {/* Logo on erillään SVG:stä, jotta se voi jäädä näkyviin kun SVG-sisältö katoaa */}
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