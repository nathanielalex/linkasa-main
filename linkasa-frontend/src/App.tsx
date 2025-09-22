import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExercisePage from "./pages/ExercisePage";
import LearnPage from "./pages/LearnPage";
import ForumPage from "./pages/ForumPage";
import ThreadPage from "./pages/ThreadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FlashcardPage from "./pages/FlashcardPage";
import DashboardLayout from "./components/DashboardLayout";
import { Toaster } from "sonner";
import CreateThreadPage from "./pages/CreateThreadPage";
import QuizPage from "./pages/QuizPage";
import QuizStartMenu from "./pages/StartQuizPage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/practice" element={<LearnPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/create" element={<CreateThreadPage />} />
            <Route path="/forum/thread/:id" element={<ThreadPage />} />
            <Route path="/start-quiz" element={<QuizStartMenu />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/practice/:id" element={<ExercisePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/flashcard" element={<FlashcardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
