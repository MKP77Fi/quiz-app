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
  // showSplash-tila on periaatteessa ylimääräinen tässä rakenteessa, 
  // mutta pidetään se mukana jos haluat myöhemmin erillisen logiikan.
  const [showSplash, setShowSplash] = useState(false); 

  // Tarkista onko animaatio jo nähty tässä sessiossa
  useEffect(() => {
    const animationSeen = sessionStorage.getItem('animationSeen');
    if (animationSeen) {
      setShowAnimation(false);
    }
  }, []);

  // ✅ KORJATTU LOGIIKKA: Yhteinen funktio, joka siirtää käyttäjän sovellukseen
  const enterApplication = () => {
    console.log("Siirrytään sovellukseen..."); // Debug
    sessionStorage.setItem('animationSeen', 'true');
    setShowSplash(false);
    setShowAnimation(false); // TÄMÄ on kriittinen muutos, jotta poistutaan animaationäkymästä
  };

  // Jos animaatio (tai sen sisällä oleva Splash) on käynnissä
  if (showAnimation) {
    return (
      <RouteAnimation 
        onAnimationComplete={enterApplication} // Jos animaatio ehtii loppuun ja backend on hereillä
      >
        {/* Jos backend nukkuu animaation jälkeen, RouteAnimation renderöi tämän lapsen.
            Kun SplashScreen saa yhteyden, se kutsuu enterApplication-funktiota.
        */}
        <div className="flex flex-col min-h-screen bg-background text-text-primary">
          <Header />
          <main className="flex-grow">
            <SplashScreen onReady={enterApplication} />
          </main>
          <Footer />
        </div>
      </RouteAnimation>
    );
  }

  // Varmuuden vuoksi erillinen splash-tila (jos state-hallinta muuttuu tulevaisuudessa)
  if (showSplash) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-text-primary">
        <Header />
        <main className="flex-grow">
          <SplashScreen onReady={enterApplication} />
        </main>
        <Footer />
      </div>
    );
  }

  // Varsinainen sovellus
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