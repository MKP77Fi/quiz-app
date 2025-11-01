import { useState, useEffect } from 'react'

function QuestionManagement({ onBack }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  
  // Lomakkeen tiedot
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'medium'
  })

  // Hae kysymykset
  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/questions')

      if (!response.ok) {
        throw new Error('Kysymysten haku epäonnistui')
      }

      const data = await response.json()
      setQuestions(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({
      ...formData,
      options: newOptions
    })
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    })
  }

  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      alert('Täytyy olla vähintään 2 vastausvaihtoehtoa!')
      return
    }
    const newOptions = formData.options.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      options: newOptions
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validoi
    const filledOptions = formData.options.filter(opt => opt.trim() !== '')
    if (filledOptions.length < 2) {
      alert('Täytyy olla vähintään 2 vastausvaihtoehtoa!')
      return
    }

    if (!formData.correctAnswer || !filledOptions.includes(formData.correctAnswer)) {
      alert('Oikea vastaus täytyy olla yksi vastausvaihtoehdoista!')
      return
    }

    try {
      const token = sessionStorage.getItem('token')
      const url = editingQuestion 
        ? `http://localhost:3000/api/questions/${editingQuestion._id}`
        : 'http://localhost:3000/api/questions'
      
      const method = editingQuestion ? 'PUT' : 'POST'

      const bodyData = {
        questionText: formData.questionText,
        options: filledOptions,
        correctAnswer: formData.correctAnswer,
        difficulty: formData.difficulty
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
      setEditingQuestion(null)
      setFormData({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        difficulty: 'medium'
      })
      fetchQuestions()
    } catch (err) {
      alert('Virhe: ' + err.message)
    }
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty
    })
    setShowForm(true)
  }

  const handleDelete = async (questionId) => {
    if (!confirm('Haluatko varmasti poistaa tämän kysymyksen?')) {
      return
    }

    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/questions/${questionId}`, {
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
      fetchQuestions()
    } catch (err) {
      alert('Virhe: ' + err.message)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingQuestion(null)
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: 'medium'
    })
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Ladataan kysymyksiä...</h2>
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
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>Kysymysten hallinta</h1>
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

      {/* Lisää uusi kysymys -nappi */}
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
          + Lisää uusi kysymys
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
          <h2>{editingQuestion ? 'Muokkaa kysymystä' : 'Lisää uusi kysymys'}</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Kysymysteksti */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Kysymysteksti *
              </label>
              <textarea
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                required
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1em',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  fontFamily: 'Arial, sans-serif'
                }}
              />
            </div>

            {/* Vastausvaihtoehdot */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Vastausvaihtoehdot * (vähintään 2)
              </label>
              {formData.options.map((option, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  marginBottom: '0.5rem' 
                }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Vaihtoehto ${index + 1}`}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      fontSize: '1em',
                      border: '2px solid #ddd',
                      borderRadius: '8px'
                    }}
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                style={{
                  padding: '0.5rem 1rem',
                  marginTop: '0.5rem',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }}
              >
                + Lisää vaihtoehto
              </button>
            </div>

            {/* Oikea vastaus */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Oikea vastaus *
              </label>
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
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
              >
                <option value="">Valitse oikea vastaus</option>
                {formData.options.filter(opt => opt.trim() !== '').map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Vaikeustaso */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Vaikeustaso
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
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
                <option value="easy">Helppo</option>
                <option value="medium">Keskitaso</option>
                <option value="hard">Vaikea</option>
              </select>
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
                {editingQuestion ? 'Tallenna muutokset' : 'Luo kysymys'}
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

      {/* KYSYMYSLISTA */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <h2 style={{ padding: '1.5rem', margin: 0, borderBottom: '2px solid #dee2e6' }}>
          Kysymykset ({questions.length})
        </h2>
        
        {questions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Ei kysymyksiä. Lisää ensimmäinen kysymys yllä olevasta napista.
          </div>
        ) : (
          <div>
            {questions.map((question, index) => (
              <div 
                key={question._id} 
                style={{ 
                  padding: '1.5rem',
                  borderBottom: index < questions.length - 1 ? '1px solid #dee2e6' : 'none'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1em' }}>
                      {index + 1}. {question.questionText}
                    </h3>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: 
                        question.difficulty === 'easy' ? '#d4edda' :
                        question.difficulty === 'hard' ? '#f8d7da' : '#fff3cd',
                      color:
                        question.difficulty === 'easy' ? '#155724' :
                        question.difficulty === 'hard' ? '#721c24' : '#856404',
                      borderRadius: '12px',
                      fontSize: '0.85em',
                      fontWeight: 'bold'
                    }}>
                      {question.difficulty === 'easy' ? 'Helppo' :
                       question.difficulty === 'hard' ? 'Vaikea' : 'Keskitaso'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(question)}
                      style={{
                        padding: '0.5rem 1rem',
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
                      onClick={() => handleDelete(question._id)}
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
                  </div>
                </div>

                <div style={{ marginLeft: '1rem' }}>
                  <strong>Vastausvaihtoehdot:</strong>
                  <ul style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                    {question.options.map((option, optIndex) => (
                      <li 
                        key={optIndex}
                        style={{
                          fontWeight: option === question.correctAnswer ? 'bold' : 'normal',
                          color: option === question.correctAnswer ? '#28a745' : '#333'
                        }}
                      >
                        {option}
                        {option === question.correctAnswer && ' ✓ (Oikea vastaus)'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionManagement