import { Routes, Route } from "react-router-dom";
import LoginView from "./components/LoginView";
import ModeSelector from "./components/ModeSelector";
import PracticeView from "./components/PracticeView";
import QuizView from "./components/QuizView";
import AdminView from "./components/AdminView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/mode" element={<ModeSelector />} />
      <Route path="/practice" element={<PracticeView />} />
      <Route path="/quiz" element={<QuizView />} />
      <Route path="/admin" element={<AdminView />} />
    </Routes>
  );
}

export default App;
