import express from "express";
import { authenticate } from "../middleware/auth";
import {
  createFinalQuizAttempt,
  getBestFinalQuizAttempt,
  getFinalQuizQuestions,
  getTop10FastestQuizAttempts,
} from "../controllers/quiz.controller";

const router = express.Router();

router.get("/questions", authenticate, getFinalQuizQuestions);
router.post("/attempt", authenticate, createFinalQuizAttempt);
router.get("/best-attempt", authenticate, getBestFinalQuizAttempt);
router.get("/top-ten", authenticate, getTop10FastestQuizAttempts);

export default router;
