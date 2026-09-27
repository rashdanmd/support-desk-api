import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import {
  createTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from "./service";

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

export const getTicketByIdHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid ticket ID" });
      return;
    }

    const ticket = await getTicketById(id);

    res.json(ticket);
  } catch (error) {
    console.error("Failed to get ticket:", error);

    res.status(500).json({
      message: "Failed to get ticket",
    });
  }
};

export const updateTicketHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid ticket ID" });
      return;
    }

    const ticket = await getTicketById(id);

    if (ticket.created_by !== authenticatedRequest.user.id) {
      res.status(403).json({
        message: "You can only edit your own tickets",
      });
      return;
    }

    if (ticket.status !== "pending") {
      res.status(400).json({
        message: "Only pending tickets can be edited",
      });
      return;
    }

    const updatedTicket = await updateTicket(id, req.body);

    res.json(updatedTicket);
  } catch (error) {
    console.error("Failed to update ticket:", error);

    res.status(500).json({
      message: "Failed to update ticket",
    });
  }
};
