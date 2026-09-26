import { Router } from "express";
import { getTeamsHandler } from "./handlers.js";

const router = Router();

router.get("/", getTeamsHandler);

export default router;
