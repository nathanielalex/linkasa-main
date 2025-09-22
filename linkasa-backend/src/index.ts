import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import threadRoutes from "./routes/thread.routes";
import flashcardRoutes from "./routes/flashcard.routes";
import lessonRoutes from "./routes/lesson.routes";
import quizRoutes from "./routes/quiz.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quiz', quizRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
