import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getFlashcards = async (req: Request, res: Response) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
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
    });

    res.json(flashcards);
  } catch (error) {
    console.error("getFlashcards error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
