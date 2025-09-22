import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


