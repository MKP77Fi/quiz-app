import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginView from "./components/LoginView";
import ModeSelector from "./components/ModeSelector";
import PracticeView from "./components/PracticeView";
import QuizView from "./components/QuizView";
import AdminView from "./components/AdminView";
import AdminDashboard from "./components/AdminDashboard";
import UserManagementView from "./components/UserManagementView";
import AdminQuizSettings from "./components/AdminQuizSettings";
import AdminLogs from "./components/AdminLogs";
import RouteAnimation from "./components/RouteAnimation"; // ✅ UUSI
import SplashScreen from "./components/SplashScreen"; // ✅ UUSI

function App() {
  const [showAnimation, setShowAnimation] = useState(true); // ✅ UUSI
  const [showSplash, setShowSplash] = useState(false); // ✅ UUSI

  // ✅ UUSI: Tarkista onko animaatio jo nähty tässä sessiossa
  useEffect(() => {
    const animationSeen = sessionStorage.getItem('animationSeen');
    if (animationSeen) {
      setShowAnimation(false);
    }
  }, []);

  // ✅ UUSI: Kun animaatio valmis
  const handleAnimationComplete = () => {
    sessionStorage.setItem('animationSeen', 'true');
    setShowAnimation(false);
    setShowSplash(false);
  };

  // ✅ UUSI: Kun splash valmis
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // ✅ UUSI: Jos animaatio käynnissä
  if (showAnimation) {
    return (
      <RouteAnimation 
        onAnimationComplete={handleAnimationComplete}
      >
        {/* Jos backend nukkuu, näytetään splash Header + Footer kanssa */}
        <div className="flex flex-col min-h-screen bg-background text-text-primary">
          <Header />
          <main className="flex-grow">
            <SplashScreen onReady={handleSplashComplete} />
          </main>
          <Footer />
        </div>
      </RouteAnimation>
    );
  }

  // ✅ UUSI: Jos splash käynnissä (backend heräsi animaation aikana mutta pitää odottaa)
  if (showSplash) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-text-primary">
        <Header />
        <main className="flex-grow">
          <SplashScreen onReady={handleSplashComplete} />
        </main>
        <Footer />
      </div>
    );
  }

  // ✅ Normaali sovellus (ei muutoksia alkuperäiseen)
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          {/* Julkiset reitit */}
          <Route path="/" element={<LoginView />} />
          <Route path="/mode" element={<ModeSelector />} />
          <Route path="/practice" element={<PracticeView />} />
          <Route path="/quiz" element={<QuizView />} />

          {/* Admin-reitit */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<AdminView />} />
          <Route path="/admin/users" element={<UserManagementView />} />
          <Route path="/admin/quiz-settings" element={<AdminQuizSettings />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;