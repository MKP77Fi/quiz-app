import { useState, useEffect } from 'react'

function UserManagement({ onBack }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'trainee',
    active: true
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Käyttäjien haku epäonnistui')
      }

      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = sessionStorage.getItem('token')
      const url = editingUser 
        ? `http://localhost:3000/api/users/${editingUser._id}`
        : 'http://localhost:3000/api/users'
      
      const method = editingUser ? 'PUT' : 'POST'

      const bodyData = { ...formData }
      if (editingUser && !formData.password) {
        delete bodyData.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Virhe tallennuksessa')
      }

      alert(data.message)
      setShowForm(false)
      setEditingUser(null)
      setFormData({ username: '', password: '', role: 'trainee', active: true })
      fetchUsers()
    } catch (err) {
      alert('Virhe: ' + err.message)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      active: user.active
    })
    setShowForm(true)
  }

  const handleDelete = async (userId) => {
    if (!confirm('Haluatko varmasti poistaa tämän käyttäjän?')) {
      return
    }

    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Virhe poistamisessa')
      }

      alert(data.message)
      fetchUsers()
    } catch (err) {
      alert('Virhe: ' + err.message)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({ username: '', password: '', role: 'trainee', active: true })
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container text-center">
          <h2>Ladataan käyttäjiä...</h2>
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
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h1>Käyttäjien hallinta</h1>
          <button onClick={onBack} className="btn btn-secondary">
            ← Takaisin
          </button>
        </div>

        {/* Lisää uusi käyttäjä -nappi */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary mb-md"
          >
            + Lisää uusi käyttäjä
          </button>
        )}

        {/* LOMAKE */}
        {showForm && (
          <div className="card mb-lg">
            <h2>{editingUser ? 'Muokkaa käyttäjää' : 'Lisää uusi käyttäjä'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Käyttäjätunnus *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Salasana {editingUser && '(jätä tyhjäksi jos et halua vaihtaa)'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rooli</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="trainee">Harjoittelija</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  Käyttäjä aktiivinen
                </label>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Tallenna muutokset' : 'Luo käyttäjä'}
                </button>
                
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Peruuta
                </button>
              </div>
            </form>
          </div>
        )}

        {/* KÄYTTÄJÄLISTA */}
        <div className="card">
          <h2>Käyttäjät ({users.length})</h2>
          
          {users.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--text-primary)', opacity: 0.6 }}>
              Ei käyttäjiä
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 'var(--spacing-md)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--accent-orange)' }}>Käyttäjätunnus</th>
                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--accent-orange)' }}>Rooli</th>
                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'center', color: 'var(--accent-orange)' }}>Status</th>
                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'center', color: 'var(--accent-orange)' }}>Toiminnot</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 'var(--spacing-sm)' }}>{user.username}</td>
                      <td style={{ padding: 'var(--spacing-sm)' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: user.role === 'admin' ? 'var(--accent-turquoise)' : '#28a745',
                          color: 'var(--text-light)',
                          borderRadius: 'var(--border-radius)',
                          fontSize: '0.85rem'
                        }}>
                          {user.role === 'admin' ? 'Admin' : 'Harjoittelija'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: user.active ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                          color: user.active ? '#28a745' : '#dc3545',
                          borderRadius: 'var(--border-radius)',
                          fontSize: '0.85rem'
                        }}>
                          {user.active ? 'Aktiivinen' : 'Ei aktiivinen'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn btn-warning btn-sm"
                          style={{ marginRight: 'var(--spacing-xs)' }}
                        >
                          Muokkaa
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Poista
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserManagement