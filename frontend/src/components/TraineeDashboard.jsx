function TraineeDashboard({ user, onModeSelect, onLogout }) {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-lg">
          <h1>Tervetuloa, {user.username}!</h1>
          <p style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
            Valitse harjoittelutapa
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <button
            onClick={() => onModeSelect('practice')}
            className="card"
            style={{
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 'var(--spacing-lg)',
              transition: 'all var(--transition-normal)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🎓</div>
            <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>Harjoittele kysymyksiä</h3>
            <p style={{ color: 'var(--text-primary)', opacity: 0.8, margin: 0, fontSize: '0.9rem' }}>
              Saat välitöntä palautetta vastauksistasi
            </p>
          </button>

          <button
            onClick={() => onModeSelect('exam')}
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
            <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>Aloita harjoitustentti</h3>
            <p style={{ color: 'var(--text-primary)', opacity: 0.8, margin: 0, fontSize: '0.9rem' }}>
              Vastaa kaikkiin kysymyksiin, tulos lopuksi
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

export default TraineeDashboard