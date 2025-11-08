function AdminDashboard({ user, onNavigate, onLogout }) {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-lg">
          <h1>Tervetuloa, {user.username}!</h1>
          <p style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
            Admin-hallintapaneeli
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <button
            onClick={() => onNavigate('questions')}
            className="card"
            style={{
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 'var(--spacing-lg)',
              transition: 'all var(--transition-normal)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📝</div>
            <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>Hallinnoi kysymyksiä</h3>
            <p style={{ color: 'var(--text-primary)', opacity: 0.8, margin: 0, fontSize: '0.9rem' }}>
              Lisää, muokkaa tai poista kysymyksiä
            </p>
          </button>

          <button
            onClick={() => onNavigate('users')}
            className="card"
            style={{
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 'var(--spacing-lg)',
              transition: 'all var(--transition-normal)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>👥</div>
            <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>Hallinnoi käyttäjätunnuksia</h3>
            <p style={{ color: 'var(--text-primary)', opacity: 0.8, margin: 0, fontSize: '0.9rem' }}>
              Muokkaa salasanoja ja käyttöoikeuksia
            </p>
          </button>

          <button
            onClick={() => onNavigate('exam-settings')}
            className="card"
            style={{
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 'var(--spacing-lg)',
              transition: 'all var(--transition-normal)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>⚙️</div>
            <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>Tenttiasetukset</h3>
            <p style={{ color: 'var(--text-primary)', opacity: 0.8, margin: 0, fontSize: '0.9rem' }}>
              Määritä kysymysmäärä ja aikaraja
            </p>
          </button>
        </div>

        <div className="text-center mt-lg">
          <button onClick={() => onLogout()} className="btn btn-danger">
            Kirjaudu ulos
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard