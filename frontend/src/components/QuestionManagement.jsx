import { useState, useEffect } from 'react'

function QuestionManagement({ onBack }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'medium'
  })

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
      <div className="page-wrapper">
        <div className="container text-center">
          <h2>Ladataan kysymyksiä...</h2>
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

  const difficultyColors = {
    easy: { bg: 'rgba(40, 167, 69, 0.2)', text: '#28a745' },
    medium: { bg: 'rgba(255, 193, 7, 0.2)', text: '#ffc107' },
    hard: { bg: 'rgba(220, 53, 69, 0.2)', text: '#dc3545' }
  }

  const difficultyLabels = {
    easy: 'Helppo',
    medium: 'Keskitaso',
    hard: 'Vaikea'
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h1>Kysymysten hallinta</h1>
          <button onClick={onBack} className="btn btn-secondary">
            ← Takaisin
          </button>
        </div>

        {/* Lisää uusi kysymys -nappi */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary mb-md"
          >
            + Lisää uusi kysymys
          </button>
        )}

        {/* LOMAKE */}
        {showForm && (
          <div className="card mb-lg">
            <h2>{editingQuestion ? 'Muokkaa kysymystä' : 'Lisää uusi kysymys'}</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Kysymysteksti */}
              <div className="form-group">
                <label className="form-label">Kysymysteksti *</label>
                <textarea
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="form-textarea"
                />
              </div>

              {/* Vastausvaihtoehdot */}
              <div className="form-group">
                <label className="form-label">Vastausvaihtoehdot * (vähintään 2)</label>
                {formData.options.map((option, index) => (
                  <div key={index} style={{ display: 'flex', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Vaihtoehto ${index + 1}`}
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="btn btn-danger"
                        style={{ padding: '0.75rem 1rem' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 'var(--spacing-xs)' }}
                >
                  + Lisää vaihtoehto
                </button>
              </div>

              {/* Oikea vastaus */}
              <div className="form-group">
                <label className="form-label">Oikea vastaus *</label>
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleInputChange}
                  required
                  className="form-select"
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
              <div className="form-group">
                <label className="form-label">Vaikeustaso</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="easy">Helppo</option>
                  <option value="medium">Keskitaso</option>
                  <option value="hard">Vaikea</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button type="submit" className="btn btn-primary">
                  {editingQuestion ? 'Tallenna muutokset' : 'Luo kysymys'}
                </button>
                
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Peruuta
                </button>
              </div>
            </form>
          </div>
        )}

        {/* KYSYMYSLISTA */}
        <div className="card">
          <h2>Kysymykset ({questions.length})</h2>
          
          {questions.length === 0 ? (
            <p className="text-center mt-md" style={{ color: 'var(--text-primary)', opacity: 0.6 }}>
              Ei kysymyksiä. Lisää ensimmäinen kysymys yllä olevasta napista.
            </p>
          ) : (
            <div>
              {questions.map((question, index) => (
                <div 
                  key={question._id} 
                  style={{ 
                    padding: 'var(--spacing-lg)',
                    borderBottom: index < questions.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--spacing-md)',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-md)'
                  }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '1.1rem' }}>
                        {index + 1}. {question.questionText}
                      </h3>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: difficultyColors[question.difficulty].bg,
                        color: difficultyColors[question.difficulty].text,
                        borderRadius: 'var(--border-radius)',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                      }}>
                        {difficultyLabels[question.difficulty]}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                      <button
                        onClick={() => handleEdit(question)}
                        className="btn btn-warning btn-sm"
                      >
                        Muokkaa
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Poista
                      </button>
                    </div>
                  </div>

                  <div style={{ marginLeft: 'var(--spacing-md)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Vastausvaihtoehdot:</strong>
                    <ul style={{ marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
                      {question.options.map((option, optIndex) => (
                        <li 
                          key={optIndex}
                          style={{
                            fontWeight: option === question.correctAnswer ? '600' : '400',
                            color: option === question.correctAnswer ? '#28a745' : 'var(--text-primary)',
                            marginBottom: '0.25rem'
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
    </div>
  )
}

export default QuestionManagement