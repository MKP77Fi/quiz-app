import { useState } from 'react'

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kirjautuminen epäonnistui')
      }

      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(data.user))
      onLoginSuccess(data.user)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center-content">
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="card">
          <h1 className="text-center">TSW Ajolupakoe</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Käyttäjätunnus</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input"
                placeholder="Syötä käyttäjätunnus"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salasana</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Syötä salasana"
              />
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
            >
              {loading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
            </button>
          </form>

          <div className="card mt-md" style={{ 
            backgroundColor: 'var(--input-background)', 
            padding: 'var(--spacing-md)',
            fontSize: '0.9rem'
          }}>
            <strong style={{ color: 'var(--accent-turquoise)' }}>Testikäyttäjät:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              <div>Admin: <code style={{ color: 'var(--accent-orange)' }}>admin</code> / <code style={{ color: 'var(--accent-orange)' }}>admin123</code></div>
              <div>Harjoittelija: <code style={{ color: 'var(--accent-orange)' }}>harjoittelija</code> / <code style={{ color: 'var(--accent-orange)' }}>harjoittelija123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login