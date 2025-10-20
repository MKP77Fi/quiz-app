import { useState, useEffect } from 'react'

function App() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Uudet state-muuttujat
  const [mode, setMode] = useState(null) // null | 'practice' | 'exam'
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([]) // Tallennetaan vastaukset tenttitilassa

  useEffect(() => {
    fetch('http://localhost:3000/api/questions')
      .then(response => {
        if (!response.ok) {
          throw new Error('Kysymysten haku epäonnistui')
        }
        return response.json()
      })
      .then(data => {
        setQuestions(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnswers([])
  }

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option)
  }

  const handleNext = () => {
    if (mode === 'exam') {
      // Tenttitilassa: tallenna vastaus ja siirry eteenpäin
      setAnswers([...answers, { 
        questionId: questions[currentIndex]._id, 
        answer: selectedAnswer 
      }])
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
    } else if (mode === 'exam') {
      // Viimeinen kysymys tenttitilassa → näytä tulokset
      calculateResults()
    }
  }

  const handlePracticeNext = () => {
    const currentQuestion = questions[currentIndex]
    
    if (!selectedAnswer) {
      alert('Valitse vastaus ensin!')
      return
    }

    // Harjoittelutilassa: tarkista heti
    if (selectedAnswer === currentQuestion.correctAnswer) {
      alert('Oikein! ✅')
      // Siirry seuraavaan
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedAnswer(null)
      } else {
        alert('Kaikki kysymykset käyty läpi!')
        setMode(null) // Palaa alkuun
      }
    } else {
      alert(`Väärin! ❌ Oikea vastaus: ${currentQuestion.correctAnswer}`)
      setSelectedAnswer(null) // Anna yrittää uudelleen
    }
  }

  const calculateResults = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer.answer === questions[index].correctAnswer) {
        correct++
      }
    })
    alert(`Tentti päättyi!\n\nOikein: ${correct}/${questions.length}`)
    setMode(null) // Palaa alkuun
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
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Ei kysymyksiä tietokannassa</h2>
        <p>Lisää kysymyksiä admin-paneelista</p>
      </div>
    )
  }

  // ALOITUSNÄKYMÄ - Valitse tila
  if (!mode) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '4rem auto', 
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '2rem' }}>
          TSW Ajolupakoe
        </h1>
        <p style={{ marginBottom: '3rem', color: '#666' }}>
          Valitse harjoittelutila
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={() => handleModeSelect('practice')}
            style={{
              padding: '1.5rem',
              fontSize: '1.2em',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🎓 Harjoittelutila
            <div style={{ fontSize: '0.8em', marginTop: '0.5rem', fontWeight: 'normal' }}>
              Saat välitöntä palautetta vastauksistasi
            </div>
          </button>

          <button
            onClick={() => handleModeSelect('exam')}
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
            📝 Tenttitila
            <div style={{ fontSize: '0.8em', marginTop: '0.5rem', fontWeight: 'normal' }}>
              Vastaa kaikkiin kysymyksiin, tulos lopuksi
            </div>
          </button>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.9em', color: '#666' }}>
          Kysymyksiä yhteensä: {questions.length}
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  // KYSYMYSNÄKYMÄ (harjoittelu tai tentti)
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '2rem auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Otsikko ja tila */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>TSW Ajolupakoe</h1>
        <div style={{ 
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: mode === 'practice' ? '#28a745' : '#007bff',
          color: 'white',
          borderRadius: '20px',
          fontSize: '0.9em',
          marginTop: '0.5rem'
        }}>
          {mode === 'practice' ? '🎓 Harjoittelutila' : '📝 Tenttitila'}
        </div>
      </div>

      {/* Kysymyslaskuri */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '1rem',
        color: '#666',
        fontSize: '0.9em'
      }}>
        Kysymys {currentIndex + 1} / {questions.length}
      </div>

      {/* Kysymyskortti */}
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3em' }}>
          {currentQuestion.questionText}
        </h2>

        {/* Vastausvaihtoehdot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              style={{
                padding: '1rem',
                fontSize: '1em',
                border: selectedAnswer === option ? '3px solid #007bff' : '2px solid #ddd',
                borderRadius: '8px',
                background: selectedAnswer === option ? '#e7f3ff' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontWeight: selectedAnswer === option ? 'bold' : 'normal'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigointipainikkeet */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <button
          onClick={() => setMode(null)}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1em',
            border: '2px solid #dc3545',
            borderRadius: '8px',
            background: 'white',
            color: '#dc3545',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Lopeta
        </button>

        <button
          onClick={mode === 'practice' ? handlePracticeNext : handleNext}
          disabled={!selectedAnswer}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1em',
            border: 'none',
            borderRadius: '8px',
            background: !selectedAnswer ? '#ccc' : (mode === 'practice' ? '#28a745' : '#007bff'),
            color: 'white',
            cursor: !selectedAnswer ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {mode === 'practice' ? 'Tarkista' : 
           (currentIndex === questions.length - 1 ? 'Lopeta tentti' : 'Seuraava')} →
        </button>
      </div>
    </div>
  )
}

export default App