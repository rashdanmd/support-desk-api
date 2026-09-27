import { User } from "@supabase/supabase-js";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: User;
  role: UserRole;
}

export type UserRole = "user" | "support" | "admin";
