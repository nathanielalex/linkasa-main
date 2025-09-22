import express, { NextFunction } from "express";
import { authenticate } from "../middleware/auth";
import { createReply, createThread, deleteThread, getThread, getThreads } from "../controllers/thread.controller";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/", authenticate, getThreads);
router.get("/:threadId", authenticate, getThread);
router.post("/", authenticate, upload.array("images", 5), createThread);
router.post("/:threadId/reply", authenticate, createReply);
router.delete("/:id", authenticate, deleteThread);

export default router;
