import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createFinalQuizAttempt = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { score, completionTime, answers } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (typeof score !== "number" || score < 0 || score > 100) {
    return res.status(400).json({ message: "Invalid score" });
  }

  if (!Number.isInteger(completionTime) || completionTime <= 0) {
    return res.status(400).json({ message: "Invalid completion time" });
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "Invalid or missing answers" });
  }

  for (const answer of answers) {
    if (
      !Number.isInteger(answer.questionNumber) ||
      !Number.isInteger(answer.alphabetId) ||
      typeof answer.userAnswer !== "string" ||
      answer.userAnswer.length !== 1 ||
      typeof answer.isCorrect !== "boolean"
    ) {
      return res.status(400).json({ message: "Invalid answer format" });
    }
  }

  try {
    const quizAttempt = await prisma.finalQuizAttempt.create({
      data: {
        userId,
        score,
        completionTime,
        answers: {
          create: answers.map((answer: any) => ({
            questionNumber: answer.questionNumber,
            alphabetId: answer.alphabetId,
            userAnswer: answer.userAnswer,
            isCorrect: answer.isCorrect,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        answers: {
          include: {
            alphabet: {
              select: {
                id: true,
                letter: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(quizAttempt);
  } catch (error) {
    console.error("createFinalQuizAttempt error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getTop10FastestQuizAttempts = async (
  req: Request,
  res: Response
) => {
  try {
    const quizAttempts = await prisma.finalQuizAttempt.findMany({
      take: 10,
      orderBy: [{ score: "desc" }, { completionTime: "asc" }],
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        answers: {
          include: {
            alphabet: {
              select: {
                id: true,
                letter: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    res.json(quizAttempts);
  } catch (error) {
    console.error("getTop10FastestQuizAttempts error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFinalQuizQuestions = async (req: Request, res: Response) => {
  try {
    const exercises = await prisma.exercise.findMany({
      include: {
        correctAlphabet: {
          select: {
            id: true,
            letter: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    if (exercises.length === 0) {
      return res.status(404).json({ message: "No exercises found" });
    }

    res.json(exercises);
  } catch (error) {
    console.error("getFinalQuizQuestions error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getBestFinalQuizAttempt = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const bestAttempt = await prisma.finalQuizAttempt.findFirst({
      where: { userId },
      orderBy: [{ score: "desc" }, { completionTime: "asc" }],
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        answers: {
          include: {
            alphabet: {
              select: {
                id: true,
                letter: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!bestAttempt) {
      return res
        .status(404)
        .json({ message: "No quiz attempts found for this user" });
    }

    res.json(bestAttempt);
  } catch (error) {
    console.error("getBestFinalQuizAttempt error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};