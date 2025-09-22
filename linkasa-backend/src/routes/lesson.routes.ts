import express from "express";
import { authenticate } from "../middleware/auth";
import { createUserLessonProgress, getExercisesByLesson, getLessonsWithProgress, getUserLessonProgress } from "../controllers/lesson.controller";
const router = express.Router();

router.get("/", authenticate, getLessonsWithProgress);
router.get("/exercise/:lessonId", authenticate, getExercisesByLesson);
router.post("/progress", authenticate, createUserLessonProgress);
router.get("/progress", authenticate, getUserLessonProgress);

export default router;
