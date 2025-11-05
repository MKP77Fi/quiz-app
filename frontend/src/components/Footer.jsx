// frontend/src/components/Footer.jsx
import "../index.css"; // varmistetaan että tyylit on käytössä

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} TSW Group – Ajolupaharjoittelu-sovellus
      </p>
    </footer>
  );
}
