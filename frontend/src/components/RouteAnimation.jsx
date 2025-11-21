// src/components/RouteAnimation.jsx
import { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';

function RouteAnimation({ children, onAnimationComplete }) {
  const [animationPhase, setAnimationPhase] = useState('intro');

  useEffect(() => {
    const runAnimation = async () => {
      // 1. Odota DOM
      await new Promise(resolve => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve, { once: true });
      });

      // 2. Reduced motion check
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (await checkBackend()) {
          setAnimationPhase('ready');
          onAnimationComplete();
        } else {
          setAnimationPhase('splash');
        }
        return;
      }

      // 3. Generoi uniikki satunnaispolku
      generateSpiralPath();

      // 4. Suorita animaatiosykli
      // 0s-7s: Ajo
      // 6s: Logo ilmestyy
      // 7s: Tie ja autot katoavat
      // 9s: Logo katoaa
      // 9.6s: Valmis
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

  // --- UUSI DYNAAMINEN REITTIGENERAATTORI ---
  const generateSpiralPath = () => {
    const centerX = 400;
    const centerY = 300;
    
    // Apufunktio pisteen laskemiseen kulman ja säteen perusteella
    const getPoint = (angleDeg, radius) => {
      const rad = (angleDeg * Math.PI) / 180;
      return {
        x: centerX + Math.cos(rad) * radius,
        y: centerY + Math.sin(rad) * radius
      };
    };

    // Apufunktio tangenttivektorille (kurvin "kahva")
    const getTangent = (angleDeg, length) => {
      // Tangentti on 90 astetta kulmasta (jotta auto kulkee "tietä pitkin" eikä poikittain)
      const rad = ((angleDeg + 90) * Math.PI) / 180;
      return {
        x: Math.cos(rad) * length,
        y: Math.sin(rad) * length
      };
    };

    // 1. Arvotaan mutkien määrä (1, 2 tai 3 segmenttiä)
    const numSegments = Math.floor(Math.random() * 3) + 1;
    
    // 2. Arvotaan lähtökulma (mistä suunnasta auto tulee)
    const startAngle = Math.random() * 360;

    // 3. Arvotaan kiertosuunta (1 = myötäpäivään, -1 = vastapäivään)
    const direction = Math.random() > 0.5 ? 1 : -1;

    // Määritellään polun pisteet
    // Lähtösäde on 800 (reilusti ruudun ulkopuolella), loppusäde on 0 (keskipiste)
    let currentRadius = 800;
    let currentAngle = startAngle;
    let pathString = '';

    // Lasketaan aloituspiste
    const startPt = getPoint(currentAngle, currentRadius);
    pathString += `M ${startPt.x.toFixed(1)},${startPt.y.toFixed(1)}`;

    // Luodaan silmukassa Bezier-käyriä (C) kohti keskustaa
    for (let i = 0; i < numSegments; i++) {
      // Kuinka suuri osuus matkasta tämä segmentti on?
      // Viimeinen segmentti menee aina nollaan.
      const isLast = i === numSegments - 1;
      
      // Seuraava säde: pienenee kohti nollaa
      // Esim. jos 3 segmenttiä: 800 -> 500 -> 200 -> 0
      const nextRadius = isLast ? 0 : currentRadius * (0.4 + Math.random() * 0.3);
      
      // Seuraava kulma: käännetään tietty astemäärä (jyrkkyys vaihtelee)
      // Arvotaan käännöksen suuruus per segmentti (esim. 60 - 120 astetta)
      const angleStep = (60 + Math.random() * 60) * direction;
      const nextAngle = currentAngle + angleStep;

      const pStart = getPoint(currentAngle, currentRadius);
      const pEnd = isLast ? { x: centerX, y: centerY } : getPoint(nextAngle, nextRadius);

      // Tangenttien pituudet (vaikuttavat mutkan loivuuteen)
      // Pituus skaalataan säteen mukaan, jotta mutkat tiukkenevat keskustaa kohti
      const tLengthStart = currentRadius * 0.5; 
      const tLengthEnd = isLast ? 0 : nextRadius * 0.5; // Keskipisteessä ei enää vauhtia ulospäin

      const tStart = getTangent(currentAngle, tLengthStart * direction); 
      const tEnd = getTangent(nextAngle, -tLengthEnd * direction); // Miinus, koska tullaan "sisään"

      // Rakennetaan Bezier-komento: C cp1x,cp1y cp2x,cp2y x,y
      const cp1 = { x: pStart.x + tStart.x, y: pStart.y + tStart.y };
      const cp2 = { x: pEnd.x + tEnd.x, y: pEnd.y + tEnd.y };

      pathString += `
        C ${cp1.x.toFixed(1)},${cp1.y.toFixed(1)}
          ${cp2.x.toFixed(1)},${cp2.y.toFixed(1)}
          ${pEnd.x.toFixed(1)},${pEnd.y.toFixed(1)}
      `;

      // Päivitetään muuttujat seuraavaa kierrosta varten
      currentRadius = nextRadius;
      currentAngle = nextAngle;
    }

    // Päivitä SVG-polku
    const roadPath = document.getElementById('road-path');
    if (roadPath) {
      roadPath.setAttribute('d', pathString);
      
      // Päivitä CSS custom property autoille
      const container = document.getElementById('animation-container');
      if (container) {
        // Siistitään stringi CSS:ää varten
        const cleanPath = pathString.replace(/\s+/g, ' ').trim();
        container.style.setProperty('--motion-path', `path('${cleanPath}')`);
      }
    }
  };

  if (animationPhase === 'intro') {
    return (
      <div className="fixed inset-0 bg-[#1A1A1A] flex items-center justify-center z-50">
        <style>{`
          /* Container keskelle */
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

          #animation-container svg {
            width: 100%;
            height: 100%;
            overflow: hidden; 
          }

          /* --- SCENE FADE OUT (7s) --- */
          /* Tie ja autot katoavat ensin */
          .scene-content {
            animation: fadeOutScene 1.5s ease-in-out 7s forwards;
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
            animation: driveCar 7s ease-in-out forwards;
            will-change: offset-distance, transform;
          }

          /* Haamuautot */
          .ghost-car { mix-blend-mode: screen; }
          .ghost-1 { animation-delay: 0.04s; opacity: 0.5; }
          .ghost-2 { animation-delay: 0.08s; opacity: 0.35; }
          .ghost-3 { animation-delay: 0.12s; opacity: 0.2; }
          .ghost-4 { animation-delay: 0.16s; opacity: 0.1; }

          /* --- LOGO CONTROLS --- */
          .logo-reveal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            /* 1. Logo esiin (6.0s) 
               2. Logo pois (9.0s) -> jättää tyhjän ruudun ennen unmountia
            */
            animation: 
              revealLogo 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 6.0s forwards,
              fadeOutLogo 0.6s ease-in 9.0s forwards;
          }

          .logo-reveal img {
            width: 270px; /* Iso logo */
            height: 270px;
            object-fit: contain;
            filter: drop-shadow(0 0 20px rgba(28, 177, 207, 0.6));
          }

          @keyframes driveCar { to { offset-distance: 100%; } }
          @keyframes drawPath { to { stroke-dashoffset: 0; } }
          
          /* Scene fade out (tie + autot) */
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

          /* Logo fade out (lopullinen tyhjennys) */
          @keyframes fadeOutLogo {
            from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(1.15); filter: blur(8px); }
          }

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

            {/* Tie ja autot ryhmässä -> feidaavat pois yhdessä */}
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