import { useState, useEffect } from 'react'

function UserManagement({ onBack }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  // Lomakkeen tiedot
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'trainee',
    active: true
  })

  // Hae käyttäjät
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

      // Jos muokataan eikä salasanaa anneta, älä lähetä sitä
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
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Ladataan käyttäjiä...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <h2>Virhe: {error}</h2>
        <button onClick={onBack} style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Takaisin
        </button>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>Käyttäjien hallinta</h1>
        <button
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Takaisin
        </button>
      </div>

      {/* Lisää uusi käyttäjä -nappi */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '0.75rem 1.5rem',
            marginBottom: '2rem',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Lisää uusi käyttäjä
        </button>
      )}

      {/* LOMAKE */}
      {showForm && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2>{editingUser ? 'Muokkaa käyttäjää' : 'Lisää uusi käyttäjä'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Käyttäjätunnus *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1em',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Salasana {editingUser && '(jätä tyhjäksi jos et halua vaihtaa)'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1em',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Rooli
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1em',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="trainee">Harjoittelija</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  style={{ marginRight: '0.5rem', width: '20px', height: '20px' }}
                />
                <span style={{ fontWeight: 'bold' }}>Käyttäjä aktiivinen</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {editingUser ? 'Tallenna muutokset' : 'Luo käyttäjä'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Peruuta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KÄYTTÄJÄLISTA */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Käyttäjätunnus
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                Rooli
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                Status
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                Toiminnot
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{user.username}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: user.role === 'admin' ? '#007bff' : '#28a745',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.85em'
                  }}>
                    {user.role === 'admin' ? 'Admin' : 'Harjoittelija'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: user.active ? '#d4edda' : '#f8d7da',
                    color: user.active ? '#155724' : '#721c24',
                    borderRadius: '12px',
                    fontSize: '0.85em'
                  }}>
                    {user.active ? 'Aktiivinen' : 'Ei aktiivinen'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      padding: '0.5rem 1rem',
                      marginRight: '0.5rem',
                      background: '#ffc107',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9em'
                    }}
                  >
                    Muokkaa
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9em'
                    }}
                  >
                    Poista
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Ei käyttäjiä
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement