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

      // 3. Generoi spiraalipolku
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

  // --- SPIRAALIGENERAATTORI ---
  const generateSpiralPath = () => {
    const centerX = 400;
    const centerY = 300;
    const startRadius = 800; // Aloitetaan ruudun ulkopuolelta

    // 1. Arvotaan suunta (1 = myötäpäivään, -1 = vastapäivään)
    const direction = Math.random() > 0.5 ? 1 : -1;

    // 2. Arvotaan aloituskulma (0-360 astetta)
    const startAngle = Math.random() * 360;

    // 3. Määritetään spiraalin "tiukkuus" eli kokonaiskiertymä.
    // Jotta se näyttää spiraalilta, vaaditaan vähintään puoli kierrosta (180),
    // enintään n. 1.5 kierrosta (540). Tämä estää "suorat" reitit.
    const totalRotation = 180 + Math.random() * 360; 

    // 4. Jaetaan reitti paloihin (mutkiin).
    // Enemmän paloja = monimutkaisempi spiraali.
    const steps = 3 + Math.floor(Math.random() * 3); // 3-5 palaa

    // Apufunktio koordinaateille
    const getPos = (deg, r) => {
      const rad = (deg * Math.PI) / 180;
      return {
        x: centerX + Math.cos(rad) * r,
        y: centerY + Math.sin(rad) * r
      };
    };

    // Rakennetaan SVG polku
    let currentAngle = startAngle;
    let currentRadius = startRadius;
    
    const startPt = getPos(currentAngle, currentRadius);
    let pathString = `M ${startPt.x.toFixed(1)},${startPt.y.toFixed(1)}`;

    // Lasketaan askeleet
    const anglePerStep = totalRotation / steps;
    
    for (let i = 1; i <= steps; i++) {
      const isLast = i === steps;

      // Lasketaan seuraava päätepiste tälle segmentille
      // Kulma etenee suunnan mukaan
      const nextAngle = startAngle + (anglePerStep * i * direction);
      
      // Säde pienenee kohti nollaa. Käytetään hieman epälineaarista
      // pienenemistä, jotta loppu ei näytä liian jyrkältä törmäykseltä.
      // Viimeinen piste on aina tasan 0 (keskipiste).
      const radiusProgress = i / steps;
      const nextRadius = isLast ? 0 : startRadius * (1 - Math.pow(radiusProgress, 0.8));

      const pStart = getPos(currentAngle, currentRadius);
      const pEnd = isLast ? { x: centerX, y: centerY } : getPos(nextAngle, nextRadius);

      // --- MUTKIEN GENEROINTI (Bezier Control Points) ---
      // Lasketaan kontrollipisteet niin, että ne mukailevat ympyrän tangenttia,
      // mutta lisäämme satunnaisuutta pituuteen, mikä luo "mutkia" spiraaliin.
      
      // Tangentti on 90 astetta säteestä
      const tangentAngle1 = currentAngle + (90 * direction);
      const tangentAngle2 = nextAngle - (90 * direction); // Huom: miinus, koska tullaan toisesta päästä

      // Kontrollipisteiden etäisyys ("kahvan pituus").
      // Peruskaava ympyrälle on n. 0.55 * säde, mutta vaihtelemme tätä
      // satunnaisesti (0.8 - 1.5 kerroin), jotta mutkat ovat eri jyrkkyyksiä.
      const segmentAngleSpanRad = (anglePerStep * Math.PI) / 180;
      const baseControlLen1 = (currentRadius * segmentAngleSpanRad) * 0.4;
      const baseControlLen2 = (nextRadius * segmentAngleSpanRad) * 0.4;
      
      const randomWobble1 = 0.8 + Math.random() * 0.6; // Vaihtelu
      const randomWobble2 = 0.8 + Math.random() * 0.6;

      const cp1 = getPos(tangentAngle1, baseControlLen1 * randomWobble1); 
      // getPos laskee keskipisteestä, mutta tangentti on suhteellinen pisteeseen.
      // Korjataan vektorilaskenta:
      const cp1Abs = {
        x: pStart.x + Math.cos(tangentAngle1 * Math.PI/180) * (baseControlLen1 * randomWobble1),
        y: pStart.y + Math.sin(tangentAngle1 * Math.PI/180) * (baseControlLen1 * randomWobble1)
      };

      const cp2Abs = {
        x: pEnd.x + Math.cos(tangentAngle2 * Math.PI/180) * (baseControlLen2 * randomWobble2),
        y: pEnd.y + Math.sin(tangentAngle2 * Math.PI/180) * (baseControlLen2 * randomWobble2)
      };

      pathString += `
        C ${cp1Abs.x.toFixed(1)},${cp1Abs.y.toFixed(1)}
          ${cp2Abs.x.toFixed(1)},${cp2Abs.y.toFixed(1)}
          ${pEnd.x.toFixed(1)},${pEnd.y.toFixed(1)}
      `;

      // Päivitä loopin tila
      currentAngle = nextAngle;
      currentRadius = nextRadius;
    }

    // Päivitä DOM
    const roadPath = document.getElementById('road-path');
    if (roadPath) {
      roadPath.setAttribute('d', pathString);
      
      const container = document.getElementById('animation-container');
      if (container) {
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
            animation: 
              revealLogo 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 6.0s forwards,
              fadeOutLogo 0.6s ease-in 9.0s forwards;
          }

          .logo-reveal img {
            width: 270px;
            height: 270px;
            object-fit: contain;
            filter: drop-shadow(0 0 20px rgba(28, 177, 207, 0.6));
          }

          @keyframes driveCar { to { offset-distance: 100%; } }
          @keyframes drawPath { to { stroke-dashoffset: 0; } }
          
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