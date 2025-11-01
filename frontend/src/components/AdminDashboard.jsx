function AdminDashboard({ user, onNavigate, onLogout }) {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '4rem auto',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: '1rem' }}>
        Tervetuloa, {user.username}!
      </h1>
      <p style={{ color: '#666', marginBottom: '3rem' }}>
        Admin-hallintapaneeli
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={() => onNavigate('questions')}
          style={{
            padding: '1.5rem',
            fontSize: '1.2em',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📝 Hallinnoi kysymyksiä
          <div style={{ fontSize: '0.8em', marginTop: '0.5rem', fontWeight: 'normal' }}>
            Lisää, muokkaa tai poista kysymyksiä
          </div>
        </button>

        <button
          onClick={() => onNavigate('users')}
          style={{
            padding: '1.5rem',
            fontSize: '1.2em',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          👥 Hallinnoi käyttäjätunnuksia
          <div style={{ fontSize: '0.8em', marginTop: '0.5rem', fontWeight: 'normal' }}>
            Muokkaa salasanoja ja käyttöoikeuksia
          </div>
        </button>
      </div>

      <button
        onClick={() => onLogout()}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          background: 'white',
          color: '#dc3545',
          border: '2px solid #dc3545',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Kirjaudu ulos
      </button>
    </div>
  )
}

export default AdminDashboard