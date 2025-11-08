import { useState, useEffect } from 'react'

function ExamSettings({ onBack }) {
  const [settings, setSettings] = useState({ questionCount: 10, timeLimit: 20 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/exam-settings')

      if (!response.ok) {
        throw new Error('Asetusten haku epäonnistui')
      }

      const data = await response.json()
      setSettings(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSettings({
      ...settings,
      [name]: parseInt(value)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/exam-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Virhe tallennuksessa')
      }

      alert(data.message)
    } catch (err) {
      alert('Virhe: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container text-center">
          <h2>Ladataan asetuksia...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container text-center">
          <div className="form-error">{error}</div>
          <button onClick={onBack} className="btn btn-primary mt-md">
            Takaisin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h1>Tenttiasetukset</h1>
          <button onClick={onBack} className="btn btn-secondary">
            ← Takaisin
          </button>
        </div>

        <div className="card">
          <h2 className="mb-md">Määritä tentin parametrit</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Kysymysmäärä */}
            <div className="form-group">
              <label className="form-label">
                Kysymysten määrä tentissä
              </label>
              <input
                type="number"
                name="questionCount"
                value={settings.questionCount}
                onChange={handleInputChange}
                min="1"
                max="100"
                required
                className="form-input"
              />
              <small style={{ color: 'var(--text-primary)', opacity: 0.7, display: 'block', marginTop: 'var(--spacing-xs)' }}>
                Kuinka monta kysymystä tentissä arvotaan (1-100)
              </small>
            </div>

            {/* Aikaraja */}
            <div className="form-group">
              <label className="form-label">
                Aikaraja (minuutteina)
              </label>
              <input
                type="number"
                name="timeLimit"
                value={settings.timeLimit}
                onChange={handleInputChange}
                min="1"
                max="180"
                required
                className="form-input"
              />
              <small style={{ color: 'var(--text-primary)', opacity: 0.7, display: 'block', marginTop: 'var(--spacing-xs)' }}>
                Kuinka kauan aikaa tentissä on käytettävissä (1-180 minuuttia)
              </small>
            </div>

            {/* Esikatselu */}
            <div className="card-compact" style={{ 
              backgroundColor: 'var(--input-background)', 
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1rem' }}>
                Esikatselunäkymä:
              </h3>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                  📝 <strong>{settings.questionCount}</strong> kysymystä
                </div>
                <div>
                  ⏱️ <strong>{settings.timeLimit}</strong> minuuttia aikaa
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Tallennetaan...' : 'Tallenna asetukset'}
            </button>
          </form>
        </div>

        {/* Info-laatikko */}
        <div className="card mt-md" style={{ backgroundColor: 'rgba(28, 177, 207, 0.1)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--accent-turquoise)' }}>
            ℹ️ Huomioitavaa
          </h3>
          <ul style={{ 
            marginLeft: 'var(--spacing-md)', 
            color: 'var(--text-primary)',
            lineHeight: 1.8
          }}>
            <li>Kysymykset arvotaan satunnaisesti jokaiselle tenttikerralle</li>
            <li>Vastausvaihtoehdot sekoitetaan satunnaiseen järjestykseen</li>
            <li>Jos kysymysmäärä ylittää tietokannassa olevat kysymykset, käytetään kaikkia saatavilla olevia</li>
            <li>Ajastin alkaa heti kun harjoittelija aloittaa tentin</li>
            <li>Kun aika loppuu, tentti päättyy automaattisesti</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ExamSettings