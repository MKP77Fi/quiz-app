// frontend/src/components/Footer.jsx

export default function Footer() {
  return (
    <footer 
      style={{
        width: '100%',
        padding: '2rem 0',
        marginTop: 'auto',
        borderTop: '1px solid #333',
        backgroundColor: '#1a1a1a',
        display: 'flex',           /* Flexbox käyttöön */
        justifyContent: 'center',  /* Vaakakeskitys */
        alignItems: 'center'       /* Pystykeskitys */
      }}
    >
      <p style={{ 
        textAlign: 'center', 
        color: '#888', 
        fontSize: '0.9rem',
        margin: 0 
      }}>
        © {new Date().getFullYear()} TSW Group – Ajolupaharjoittelu
      </p>
    </footer>
  );
}