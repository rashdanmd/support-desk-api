import { Router } from "express";
import { createTicketHandler, getTicketsHandler } from "./handlers";
import { requireAuth } from "../../middleware/auth-middleware.js";

const router = Router();

router.get("/", requireAuth, getTicketsHandler);
router.post("/", requireAuth, createTicketHandler);

export default router;
