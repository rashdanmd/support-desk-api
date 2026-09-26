import { Router } from "express";
import {
  createTicketHandler,
  getTicketByIdHandler,
  getTicketsHandler,
} from "./handlers";
import { requireAuth } from "../../middleware/auth-middleware.js";

const router = Router();

router.get("/", requireAuth, getTicketsHandler);
router.get("/:id", requireAuth, getTicketByIdHandler);
router.post("/", requireAuth, createTicketHandler);

export default router;
