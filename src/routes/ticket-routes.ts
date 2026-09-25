import { Router } from "express";
import { getTicketsHandler } from "../handlers/ticket-handlers.js";

const router = Router();

router.get("/", getTicketsHandler);

export default router;
