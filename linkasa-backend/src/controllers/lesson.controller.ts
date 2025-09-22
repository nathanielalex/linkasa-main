import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getLessonsWithProgress = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        userProgress: {
          where: { userId },
          select: {
            completedAt: true,
            score: true,
          },
        },
      },
      orderBy: {
        lessonOrder: "asc",
      },
    });

    res.json(lessons);
  } catch (error) {
    console.error("getLessonsWithProgress error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getExercisesByLesson = async (req: Request, res: Response) => {
  const { lessonId } = req.params;

  if (!lessonId || isNaN(Number(lessonId))) {
    return res.status(400).json({ message: "Invalid lesson ID" });
  }

  try {
    const exercises = await prisma.exercise.findMany({
      where: { lessonId: Number(lessonId) },
      include: {
        correctAlphabet: {
          select: {
            id: true,
            letter: true,
            imageUrl: true,
          },
        },
        options: {
          include: {
            alphabet: {
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
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    if (exercises.length === 0) {
      return res
        .status(404)
        .json({ message: "No exercises found for this lesson" });
    }

    res.json(exercises);
  } catch (error) {
    console.error("getExercisesByLesson error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { title, lessonOrder, alphabetIds } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || typeof title !== "string" || title.length > 100) {
    return res.status(400).json({ message: "Invalid or missing title" });
  }

  if (!Number.isInteger(lessonOrder) || lessonOrder < 0) {
    return res.status(400).json({ message: "Invalid lesson order" });
  }

  if (
    !Array.isArray(alphabetIds) ||
    alphabetIds.length === 0 ||
    !alphabetIds.every((id: any) => Number.isInteger(id))
  ) {
    return res.status(400).json({ message: "Invalid or missing alphabet IDs" });
  }

  try {
    const existingLesson = await prisma.lesson.findUnique({
      where: { lessonOrder },
    });

    if (existingLesson) {
      return res.status(400).json({ message: "Lesson order already exists" });
    }

    const alphabets = await prisma.alphabet.findMany({
      where: { id: { in: alphabetIds } },
    });

    if (alphabets.length !== alphabetIds.length) {
      return res
        .status(400)
        .json({ message: "One or more alphabet IDs are invalid" });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        lessonOrder,
        lessonAlphabets: {
          create: alphabetIds.map((alphabetId: number) => ({
            alphabetId,
          })),
        },
      },
      include: {
        lessonAlphabets: {
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

    res.status(201).json(lesson);
  } catch (error) {
    console.error("createLesson error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createUserLessonProgress = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { lessonId, score } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    return res.status(400).json({ message: "Invalid lesson ID" });
  }

  if (
    score !== undefined &&
    (typeof score !== "number" || score < 0 || score > 100)
  ) {
    return res.status(400).json({ message: "Invalid score" });
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const existingProgress = await prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    let progress;
    if (existingProgress) {
      progress = await prisma.userLessonProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: {
          completedAt: new Date(),
          score: score ?? existingProgress.score,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          lesson: {
            select: {
              id: true,
              title: true,
              lessonOrder: true,
            },
          },
        },
      });
    } else {
      progress = await prisma.userLessonProgress.create({
        data: {
          userId,
          lessonId,
          completedAt: new Date(),
          score: score ?? null,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          lesson: {
            select: {
              id: true,
              title: true,
              lessonOrder: true,
            },
          },
        },
      });
    }

    res.status(existingProgress ? 200 : 201).json(progress);
  } catch (error) {
    console.error("createUserLessonProgress error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserLessonProgress = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userProgress = await prisma.userLessonProgress.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            lessonOrder: true,
          },
        },
      },
      orderBy: {
        lesson: {
          lessonOrder: "asc",
        },
      },
    });

    res.json(userProgress);
  } catch (error) {
    console.error("getUserLessonProgress error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};