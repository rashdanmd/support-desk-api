import { Router } from "express";
import { getTeamsHandler } from "../handlers/team-handlers";

const router = Router();

router.get("/", getTeamsHandler);

export default router;
