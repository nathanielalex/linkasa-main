import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getThreads = async (req: Request, res: Response) => {
  try {
    const threads = await prisma.forumThread.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        images: {
          select: {
            id: true,
            image: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(threads);
  } catch (error) {
    console.error("getThreads error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createThread = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { content } = req.body;
  const files = req.files as Express.Multer.File[];
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!content || typeof content !== "string" || content.length > 200) {
    return res.status(400).json({ message: "Invalid or missing content" });
  }

  try {
    const imageRecords = files?.map((file) => ({
      image: `/uploads/${file.filename}`,
    }));

    const thread = await prisma.forumThread.create({
      data: {
        userId,
        content,
        images: imageRecords?.length
          ? {
              create: imageRecords,
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        images: {
          select: {
            id: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    res.status(201).json(thread);
  } catch (error) {
    console.error("createThread error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getThread = async (req: Request, res: Response) => {
  const { threadId } = req.params;

  if (!threadId || isNaN(Number(threadId))) {
    return res.status(400).json({ message: "Invalid thread ID" });
  }

  try {
    const thread = await prisma.forumThread.findUnique({
      where: { id: Number(threadId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        images: {
          select: {
            id: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.json(thread);
  } catch (error) {
    console.error("getThread error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteThread = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { threadId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!threadId || isNaN(Number(threadId))) {
    return res.status(400).json({ message: "Invalid thread ID" });
  }

  try {
    const thread = await prisma.forumThread.findUnique({
      where: { id: Number(threadId) },
      select: { userId: true },
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    if (thread.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own threads" });
    }

    await prisma.forumThread.delete({
      where: { id: Number(threadId) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("deleteThread error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createReply = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { threadId } = req.params;
  const { content } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!threadId || isNaN(Number(threadId))) {
    return res.status(400).json({ message: "Invalid thread ID" });
  }

  if (!content || typeof content !== "string") {
    return res.status(400).json({ message: "Invalid or missing content" });
  }

  try {
    const thread = await prisma.forumThread.findUnique({
      where: { id: Number(threadId) },
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const reply = await prisma.forumReply.create({
      data: {
        threadId: Number(threadId),
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error("createReply error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};