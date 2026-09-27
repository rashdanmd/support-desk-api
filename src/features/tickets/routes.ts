import { Router } from "express";
import {
  createTicketHandler,
  getTicketByIdHandler,
  getTicketsHandler,
  updateTicketHandler,
} from "./handlers";
import { requireAuth } from "../../middleware/auth-middleware.js";

const router = Router();

router.get("/", requireAuth, getTicketsHandler);
router.get("/:id", requireAuth, getTicketByIdHandler);
router.post("/", requireAuth, createTicketHandler);
router.patch("/:id", requireAuth, updateTicketHandler);

export default router;
