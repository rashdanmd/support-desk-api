import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase.js";
import { AuthenticatedRequest } from "../types/auth.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const token = authorization.split(" ")[1];

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  (req as AuthenticatedRequest).user = user;

  next();
};
