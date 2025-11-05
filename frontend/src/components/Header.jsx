import logo from "../assets/logo.png"; // varmista, että tiedosto on /src/assets/logo.png
import "../index.css"; // varmistetaan, että manuaalinen CSS on mukana

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo vasemmalle */}
        <div className="header-left">
          <img
            src={logo}
            alt="TSW Group logo"
            className="header-logo"
          />
        </div>

        {/* Linkki oikealle */}
        <nav className="header-nav">
          <a
            href="https://mp005840.nube.fi/tswgroup/"
            className="header-link"
          >
            TSW Group -etusivulle
          </a>
        </nav>
      </div>
    </header>
  );
}
