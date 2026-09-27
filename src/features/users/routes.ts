import { Router } from "express";

import { requireAuth } from "../../middleware/auth-middleware";
import { getCurrentUserHandler } from "./handlers";

const router = Router();

router.get("/me", requireAuth, getCurrentUserHandler);

export default router;
