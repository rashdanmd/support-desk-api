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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    res.status(401).json({
      message: "User profile not found",
    });
    return;
  }

  const authenticatedRequest = req as AuthenticatedRequest;

  authenticatedRequest.user = user;
  authenticatedRequest.role = profile.role;

  next();
};
