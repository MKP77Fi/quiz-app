import { useState, useEffect } from 'react'
import Header from './components/Header'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import TraineeDashboard from './components/TraineeDashboard'
import QuizView from './components/QuizView'
import UserManagement from './components/UserManagement'
import QuestionManagement from './components/QuestionManagement'
import ExamSettings from './components/ExamSettings'

function App() {
  const [user, setUser] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('login') // 'login' | 'dashboard' | 'quiz' | 'users' | 'questions' | 'exam-settings'
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

  const handleAdminNavigate = (destination) => {
    setView(destination)
  }

  const handleBackToDashboard = () => {
    setView('dashboard')
    setQuizMode(null)
    // Päivitä kysymykset kun palataan (jos niitä on muokattu)
    fetch('http://localhost:3000/api/questions')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(err => console.error('Virhe kysymysten päivityksessä:', err))
  }

  // Näytä loading-tila kun tarkistetaan sessionStorage
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container text-center">
          <h2>Ladataan...</h2>
        </div>
      </div>
    )
  }

  // LOGIN-näkymä (ei headeria)
  if (view === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Muut näkymät (headerilla)
  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      
      {/* EXAM SETTINGS -näkymä (vain adminille) */}
      {view === 'exam-settings' && user?.role === 'admin' && (
        <ExamSettings onBack={handleBackToDashboard} />
      )}

      {/* QUESTION MANAGEMENT -näkymä (vain adminille) */}
      {view === 'questions' && user?.role === 'admin' && (
        <QuestionManagement onBack={handleBackToDashboard} />
      )}

      {/* USER MANAGEMENT -näkymä (vain adminille) */}
      {view === 'users' && user?.role === 'admin' && (
        <UserManagement onBack={handleBackToDashboard} />
      )}

      {/* DASHBOARD-näkymä */}
      {view === 'dashboard' && (
        <>
          {user.role === 'admin' ? (
            <AdminDashboard
              user={user}
              onNavigate={handleAdminNavigate}
              onLogout={handleLogout}
            />
          ) : (
            <TraineeDashboard
              user={user}
              onModeSelect={handleModeSelect}
              onLogout={handleLogout}
            />
          )}
        </>
      )}

      {/* QUIZ-näkymä */}
      {view === 'quiz' && questions.length > 0 && (
        <QuizView
          questions={questions}
          mode={quizMode}
          onExit={handleBackToDashboard}
        />
      )}

      {/* Virhetila */}
      {error && view !== 'login' && (
        <div className="page-wrapper">
          <div className="container text-center">
            <div className="form-error">{error}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default App