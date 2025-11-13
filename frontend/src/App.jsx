// frontend/src/App.jsx
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
import AdminLogs from "./components/AdminLogs"; // ✅ uusi import

function App() {
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
          <Route path="/admin/logs" element={<AdminLogs />} /> {/* ✅ uusi reitti */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
