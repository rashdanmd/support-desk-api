import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../types/auth";

export const getCurrentUserHandler = (req: Request, res: Response): void => {
  const authenticatedRequest = req as AuthenticatedRequest;

  res.json({
    id: authenticatedRequest.user.id,
    email: authenticatedRequest.user.email,
    role: authenticatedRequest.role,
  });
};
