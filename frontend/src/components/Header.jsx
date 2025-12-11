// frontend/src/components/Header.jsx
import logo from "../assets/Logo.png";

export default function Header() {
  return (
    <header 
      className="w-full bg-background border-b border-gray-800 shadow-sm"
      style={{ 
        backgroundColor: '#1a1a1a', 
        borderBottom: '1px solid #333',
        padding: '1rem 2rem'
      }}
    >
      <div 
        className="container mx-auto"
        style={{
          display: 'flex',            /* Pakottaa riviasettelun */
          flexDirection: 'row',       /* Varmistaa että ovat vierekkäin */
          justifyContent: 'space-between', /* Työntää reunat erilleen */
          alignItems: 'center',       /* Keskittää pystysuunnassa */
          width: '100%'
        }}
      >
        
        {/* --- LOGO --- */}
        <div style={{ flexShrink: 0 }}>
          <img
            src={logo}
            alt="TSW Group logo"
            // Pakotetaan korkeus pikseleinä, jotta se ei voi räjähtää
            style={{ 
              height: '70px', 
              width: 'auto', 
              display: 'block' 
            }} 
          />
        </div>

        {/* --- LINKKI --- */}
        <nav style={{ marginLeft: 'auto' }}>
          <a
            href="https://mp005840.nube.fi/tswgroup/"
            style={{
              color: '#ffffff',           /* Pakotettu valkoinen */
              textDecoration: 'none',     /* Pakotettu ei-alleviivausta */
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.color = '#1cb1cf'}
            onMouseOut={(e) => e.target.style.color = '#ffffff'}
          >
            TSW Group -etusivulle &rarr;
          </a>
        </nav>
        
      </div>
    </header>
  );
}