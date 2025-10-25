import { useState, useEffect } from 'react'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import TraineeDashboard from './components/TraineeDashboard'
import QuizView from './components/QuizView'

function App() {
  const [user, setUser] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('login') // 'login' | 'dashboard' | 'quiz'
  const [quizMode, setQuizMode] = useState(null) // 'practice' | 'exam'

  // Tarkista onko käyttäjä jo kirjautunut (sessionStorage)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setView('dashboard')
    }
    setLoading(false)
  }, [])

  // Hae kysymykset kun sovellus latautuu
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
      })
      .catch(err => {
        setError(err.message)
      })
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setView('dashboard')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setUser(null)
    setView('login')
    setQuizMode(null)
  }

  const handleModeSelect = (mode) => {
    setQuizMode(mode)
    setView('quiz')
  }

  const handleExitQuiz = () => {
    setView('dashboard')
    setQuizMode(null)
  }

  // Näytä loading-tila kun tarkistetaan sessionStorage
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Ladataan...</h2>
      </div>
    )
  }

  // LOGIN-näkymä
  if (view === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // DASHBOARD-näkymä
  if (view === 'dashboard') {
    if (user.role === 'admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} />
    } else {
      return (
        <TraineeDashboard
          user={user}
          onModeSelect={handleModeSelect}
          onLogout={handleLogout}
        />
      )
    }
  }

  // QUIZ-näkymä
  if (view === 'quiz' && questions.length > 0) {
    return (
      <QuizView
        questions={questions}
        mode={quizMode}
        onExit={handleExitQuiz}
      />
    )
  }

  // Virhetila
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <h2>Virhe: {error}</h2>
      </div>
    )
  }

  return null
}

export default App