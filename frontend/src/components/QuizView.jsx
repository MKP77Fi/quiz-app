import { useState, useEffect } from 'react'
import { shuffleQuestions } from '../utils/shuffle'

function QuizView({ questions, mode, onExit }) {
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [quizFinished, setQuizFinished] = useState(false)
  const [score, setScore] = useState(null)
  
  // Tentti-asetukset
  const [examSettings, setExamSettings] = useState({ questionCount: 10, timeLimit: 20 })
  const [timeLeft, setTimeLeft] = useState(0) // sekunteina
  const [timerActive, setTimerActive] = useState(false)

  // Alusta quiz
  useEffect(() => {
    const initQuiz = async () => {
      if (mode === 'exam') {
        // Hae tenttiasetukset
        try {
          const response = await fetch('http://localhost:3000/api/exam-settings')
          const settings = await response.json()
          setExamSettings(settings)
          
          // Rajoita kysymysmäärä saatavilla oleviin kysymyksiin
          const count = Math.min(settings.questionCount, questions.length)
          const limited = shuffleQuestions(questions).slice(0, count)
          setShuffledQuestions(limited)
          
          // Aseta ajastin
          setTimeLeft(settings.timeLimit * 60) // minuutit -> sekunnit
          setTimerActive(true)
        } catch (err) {
          console.error('Virhe asetusten haussa:', err)
          setShuffledQuestions(shuffleQuestions(questions).slice(0, 10))
          setTimeLeft(20 * 60)
          setTimerActive(true)
        }
      } else {
        // Harjoittelutila: kaikki kysymykset
        setShuffledQuestions(shuffleQuestions(questions))
      }
    }

    initQuiz()
  }, [questions, mode])

  // Ajastin (vain tenttitilassa)
  useEffect(() => {
    if (mode === 'exam' && timerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setTimerActive(false)
            // Aika loppui -> laske tulokset
            calculateResults([...answers, { questionId: shuffledQuestions[currentIndex]?._id, answer: selectedAnswer }])
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [mode, timerActive, timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option)
  }

  const handleNext = () => {
    if (mode === 'exam') {
      const newAnswers = [...answers, {
        questionId: shuffledQuestions[currentIndex]._id,
        answer: selectedAnswer
      }]
      setAnswers(newAnswers)

      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedAnswer(null)
      } else {
        setTimerActive(false)
        calculateResults(newAnswers)
      }
    }
  }

  const handlePracticeNext = () => {
    const currentQuestion = shuffledQuestions[currentIndex]

    if (!selectedAnswer) {
      alert('Valitse vastaus ensin!')
      return
    }

    if (selectedAnswer === currentQuestion.correctAnswer) {
      alert('Oikein! ✅')
      if (currentIndex < shuffledQuestions.length - 1) {
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
      if (answer.answer === shuffledQuestions[index].correctAnswer) {
        correct++
      }
    })
    setScore(correct)
    setQuizFinished(true)
  }

  // Loading state
  if (shuffledQuestions.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container text-center">
          <h2>Ladataan kysymyksiä...</h2>
        </div>
      </div>
    )
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
              <>
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  color: score / shuffledQuestions.length >= 0.8 ? '#28a745' : '#dc3545',
                  margin: 'var(--spacing-lg) 0'
                }}>
                  {score} / {shuffledQuestions.length}
                </div>
                
                {timeLeft === 0 && (
                  <p style={{ color: '#dc3545', marginBottom: 'var(--spacing-md)' }}>
                    ⏱️ Aika loppui!
                  </p>
                )}
              </>
            )}

            {mode === 'exam' && (
              <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                {score / shuffledQuestions.length >= 0.8
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

  const currentQuestion = shuffledQuestions[currentIndex]
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100

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

        {/* Ajastin (vain tenttitilassa) */}
        {mode === 'exam' && (
          <div className="card mb-md" style={{ 
            padding: 'var(--spacing-md)', 
            textAlign: 'center',
            backgroundColor: timeLeft < 60 ? 'rgba(220, 53, 69, 0.1)' : 'var(--card-background)'
          }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              color: timeLeft < 60 ? '#dc3545' : 'var(--accent-turquoise)'
            }}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
        )}

        {/* Edistymispalkki */}
        <div className="mb-md">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: 'var(--spacing-xs)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem'
          }}>
            <span>Kysymys {currentIndex + 1} / {shuffledQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: 'var(--input-background)',
            borderRadius: 'var(--border-radius)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: mode === 'practice' ? '#28a745' : 'var(--accent-turquoise)',
              transition: 'width 0.3s ease'
            }} />
          </div>
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
            className="btn btn-primary"
          >
            {mode === 'practice' ? 'Tarkista' :
             (currentIndex === shuffledQuestions.length - 1 ? 'Lopeta tentti' : 'Seuraava')} →
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizView