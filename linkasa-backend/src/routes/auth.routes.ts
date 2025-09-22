import express from "express";
import { authenticate } from "../middleware/auth";
import { getMe, login, logout, register } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.get("/logout", authenticate, logout);

export default router;
