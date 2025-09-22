import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: hashedPassword,
    },
  });

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "Invalid credentials" });

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  res.json({ message: "Logged in successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}