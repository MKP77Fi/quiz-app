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
      const newAnswers = [...answers, {
        questionId: questions[currentIndex]._id,
        answer: selectedAnswer
      }]
      setAnswers(newAnswers)

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedAnswer(null)
      } else {
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

    if (selectedAnswer === currentQuestion.correctAnswer) {
      alert('Oikein! ✅')
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedAnswer(null)
      } else {
        setQuizFinished(true)
      }
    } else {
      alert(`Väärin! ❌ Oikea vastaus: ${currentQuestion.correctAnswer}`)
      setSelectedAnswer(null)
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
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card text-center">
            <h1 className="mb-md">
              {mode === 'practice' ? '🎓 Harjoittelu päättyi!' : '📝 Tentti päättyi!'}
            </h1>

            {mode === 'exam' && score !== null && (
              <div style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: score / questions.length >= 0.8 ? '#28a745' : '#dc3545',
                margin: 'var(--spacing-lg) 0'
              }}>
                {score} / {questions.length}
              </div>
            )}

            {mode === 'exam' && (
              <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                {score / questions.length >= 0.8
                  ? 'Hienoa työtä! Olet valmis viralliseen tenttiin. ✅'
                  : 'Harjoittele vielä lisää ennen virallista tenttiä.'}
              </p>
            )}

            {mode === 'practice' && (
              <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                Olet käynyt läpi kaikki kysymykset!
              </p>
            )}

            <button onClick={onExit} className="btn btn-primary btn-lg">
              Palaa valikkoon
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  // KYSYMYSNÄKYMÄ
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Otsikko ja tila */}
        <div className="text-center mb-md">
          <h1>TSW Ajolupakoe</h1>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: mode === 'practice' ? '#28a745' : 'var(--accent-turquoise)',
            color: 'var(--text-light)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.9rem',
            marginTop: 'var(--spacing-sm)'
          }}>
            {mode === 'practice' ? '🎓 Harjoittelutila' : '📝 Tenttitila'}
          </div>
        </div>

        {/* Kysymyslaskuri */}
        <div className="text-center mb-md" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
          Kysymys {currentIndex + 1} / {questions.length}
        </div>

        {/* Kysymyskortti */}
        <div className="card mb-md">
          <h2 className="mb-md">{currentQuestion.questionText}</h2>

          {/* Vastausvaihtoehdot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                style={{
                  padding: 'var(--spacing-md)',
                  fontSize: '1rem',
                  border: selectedAnswer === option ? '3px solid var(--accent-turquoise)' : '2px solid var(--border-subtle)',
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: selectedAnswer === option ? 'rgba(28, 177, 207, 0.1)' : 'var(--input-background)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  fontWeight: selectedAnswer === option ? '600' : '400'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigointipainikkeet */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>
          <button onClick={onExit} className="btn btn-danger">
            ← Lopeta
          </button>

          <button
            onClick={mode === 'practice' ? handlePracticeNext : handleNext}
            disabled={!selectedAnswer}
            className={mode === 'practice' ? 'btn btn-primary' : 'btn btn-primary'}
          >
            {mode === 'practice' ? 'Tarkista' :
             (currentIndex === questions.length - 1 ? 'Lopeta tentti' : 'Seuraava')} →
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizView