import { useState } from 'react'

function QuizView({ questions, mode, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [quizFinished, setQuizFinished] = useState(false)
  const [score, setScore] = useState(null)

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option)
  }

  const handleNext = () => {
    if (mode === 'exam') {
      // Tenttitilassa: tallenna vastaus
      const newAnswers = [...answers, {
        questionId: questions[currentIndex]._id,
        answer: selectedAnswer
      }]
      setAnswers(newAnswers)

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedAnswer(null)
      } else {
        // Viimeinen kysymys → laske tulokset
        calculateResults(newAnswers)
      }
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
        // Viimeinen kysymys
        setQuizFinished(true)
      }
    } else {
      alert(`Väärin! ❌ Oikea vastaus: ${currentQuestion.correctAnswer}`)
      setSelectedAnswer(null) // Anna yrittää uudelleen
    }
  }

  const calculateResults = (finalAnswers) => {
    let correct = 0
    finalAnswers.forEach((answer, index) => {
      if (answer.answer === questions[index].correctAnswer) {
        correct++
      }
    })
    setScore(correct)
    setQuizFinished(true)
  }

  // LOPPUTULOS-NÄKYMÄ
  if (quizFinished) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '4rem auto',
        padding: '2rem',
        textAlign: 'center',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '2rem' }}>
          {mode === 'practice' ? '🎓 Harjoittelu päättyi!' : '📝 Tentti päättyi!'}
        </h1>

        {mode === 'exam' && score !== null && (
          <div style={{
            fontSize: '3em',
            fontWeight: 'bold',
            color: score / questions.length >= 0.8 ? '#28a745' : '#dc3545',
            marginBottom: '1rem'
          }}>
            {score} / {questions.length}
          </div>
        )}

        {mode === 'exam' && (
          <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '2rem' }}>
            {score / questions.length >= 0.8
              ? 'Hienoa työtä! Olet valmis viralliseen tenttiin. ✅'
              : 'Harjoittele vielä lisää ennen virallista tenttiä.'}
          </p>
        )}

        {mode === 'practice' && (
          <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '2rem' }}>
            Olet käynyt läpi kaikki kysymykset!
          </p>
        )}

        <button
          onClick={onExit}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1em',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Palaa valikkoon
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  // KYSYMYSNÄKYMÄ
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
          onClick={onExit}
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

export default QuizView