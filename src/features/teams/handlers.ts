import { Request, Response } from "express";
import { getTeams } from "./service.js";

export const getTeamsHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const teams = await getTeams();

    res.status(200).json(teams);
  } catch (error) {
    console.error("Failed to get teams:", error);

    res.status(500).json({
      message: "Failed to get teams",
    });
  }
};
