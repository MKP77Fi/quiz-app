// frontend/src/App.jsx
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

import RouteAnimation from "./components/RouteAnimation";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const animationSeen = sessionStorage.getItem('animationSeen');
    if (animationSeen) setShowAnimation(false);
  }, []);

  const enterApplication = () => {
    sessionStorage.setItem('animationSeen', 'true');
    setShowAnimation(false);
  };

  if (showAnimation) {
    return (
      <RouteAnimation onAnimationComplete={enterApplication}>
        <div className="flex flex-col min-h-screen bg-background text-text-primary">
          <Header />
          <main className="flex-grow flex items-center justify-center p-4">
            <SplashScreen onReady={enterApplication} />
          </main>
          <Footer />
        </div>
      </RouteAnimation>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary font-sans">
      <Header />
      
      {/* py-12 = 3rem (48px) ylös ja alas -> Ilmavuutta
         flex-grow = Työntää footerin alas
      */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-start">
        <div className="w-full max-w-4xl">
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/mode" element={<ModeSelector />} />
            <Route path="/practice" element={<PracticeView />} />
            <Route path="/quiz" element={<QuizView />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/questions" element={<AdminView />} />
            <Route path="/admin/users" element={<UserManagementView />} />
            <Route path="/admin/quiz-settings" element={<AdminQuizSettings />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;