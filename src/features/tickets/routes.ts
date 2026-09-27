import { Router } from "express";
import {
  createTicketHandler,
  getTicketByIdHandler,
  getTicketsHandler,
  updateTicketHandler,
  cancelTicketHandler,
  startTicketReviewHandler,
  referTicketHandler,
  resolveTicketHandler,
  deleteTicketHandler,
} from "./handlers";
import { requireAuth } from "../../middleware/auth-middleware.js";

const router = Router();

router.get("/", requireAuth, getTicketsHandler);
router.get("/:id", requireAuth, getTicketByIdHandler);
router.post("/", requireAuth, createTicketHandler);
router.patch("/:id", requireAuth, updateTicketHandler);
router.patch("/:id/cancel", requireAuth, cancelTicketHandler);
router.patch("/:id/review", requireAuth, startTicketReviewHandler);
router.patch("/:id/refer", requireAuth, referTicketHandler);
router.patch("/:id/resolve", requireAuth, resolveTicketHandler);
router.delete("/:id", requireAuth, deleteTicketHandler);

export default router;
