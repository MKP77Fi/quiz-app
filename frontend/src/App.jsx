// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import LoginView from "./components/LoginView";
import ModeSelector from "./components/ModeSelector";
import PracticeView from "./components/PracticeView";
import QuizView from "./components/QuizView";
import AdminView from "./components/AdminView";
import AdminDashboard from "./components/AdminDashboard";
import UserManagementView from "./components/UserManagementView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/mode" element={<ModeSelector />} />
      <Route path="/practice" element={<PracticeView />} />
      <Route path="/quiz" element={<QuizView />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/questions" element={<AdminView />} />
      <Route path="/admin/users" element={<UserManagementView />} />

      {/* Fallback: voit lisätä 404-komponentin myöhemmin */}
    </Routes>
  );
}

export default App;
