import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import { createTicket, getTickets } from "./service";

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

export const createTicketHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;

    const { title, description, teamId, affectedUrl, curl, priority } =
      req.body;

    const ticket = await createTicket({
      title,
      description,
      teamId,
      affectedUrl,
      curl,
      priority,
      createdBy: authenticatedRequest.user.id,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Failed to create ticket:", error);

    res.status(500).json({
      message: "Failed to create ticket",
    });
  }
};
