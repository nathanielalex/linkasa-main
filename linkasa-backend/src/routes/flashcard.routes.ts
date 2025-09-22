import express from "express";
import { authenticate } from "../middleware/auth";
import { getFlashcards } from "../controllers/flashcard.controller";

const router = express.Router();

router.get("/", authenticate, getFlashcards);

export default router;
