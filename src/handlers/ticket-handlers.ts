import { Request, Response } from "express";
import { getTickets } from "../services/ticket-service";

export const getTicketsHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tickets = await getTickets();

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Failed to get tickets:", error);

    res.status(500).json({
      message: "Failed to get tickets",
    });
  }
};
