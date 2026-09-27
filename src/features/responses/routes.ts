import { Router } from "express";

import { requireAuth } from "../../middleware/auth-middleware";

import {
  createTicketResponseHandler,
  getTicketResponsesHandler,
} from "./handlers";

const router = Router();

router.get("/:ticketId/responses", requireAuth, getTicketResponsesHandler);
router.post("/:ticketId/responses", requireAuth, createTicketResponseHandler);

export default router;
