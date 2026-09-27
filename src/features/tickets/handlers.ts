import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import {
  cancelTicket,
  createTicket,
  getTicketById,
  getTickets,
  updateTicket,
  startTicketReview,
  referTicket,
  resolveTicket,
  deleteTicket,
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

export const cancelTicketHandler = async (
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
        message: "You can only cancel your own tickets",
      });
      return;
    }

    if (ticket.status !== "pending") {
      res.status(400).json({
        message: "Only pending tickets can be cancelled",
      });
      return;
    }

    const cancelledTicket = await cancelTicket(id);

    res.json(cancelledTicket);
  } catch (error) {
    console.error("Failed to cancel ticket:", error);
    res.status(500).json({
      message: "Failed to cancel ticket",
    });
  }
};

export const startTicketReviewHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    const canManage =
      authenticatedRequest.role === "support" ||
      authenticatedRequest.role === "admin";

    if (!canManage) {
      res.status(403).json({
        message: "You do not have permission to manage this ticket",
      });
      return;
    }

    const ticket = await getTicketById(id);

    if (ticket.status !== "pending") {
      res.status(400).json({
        message: "Only pending tickets can be moved into review",
      });
      return;
    }

    const updatedTicket = await startTicketReview(id);

    res.json(updatedTicket);
  } catch (error) {
    console.error("Failed to start ticket review:", error);

    res.status(500).json({
      message: "Failed to start ticket review",
    });
  }
};

export const referTicketHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    const canManage =
      authenticatedRequest.role === "support" ||
      authenticatedRequest.role === "admin";

    if (!canManage) {
      res.status(403).json({
        message: "You do not have permission to manage this ticket",
      });
      return;
    }

    const ticket = await getTicketById(id);

    if (ticket.status !== "in_review") {
      res.status(400).json({
        message: "Only tickets in review can be referred",
      });
      return;
    }

    const { message } = req.body;

    if (!message?.trim()) {
      res.status(400).json({
        message: "Referral message is required",
      });
      return;
    }

    const updatedTicket = await referTicket(id, {
      message: message.trim(),
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error("Failed to refer ticket:", error);

    res.status(500).json({
      message: "Failed to refer ticket",
    });
  }
};

export const resolveTicketHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    const canManage =
      authenticatedRequest.role === "support" ||
      authenticatedRequest.role === "admin";

    if (!canManage) {
      res.status(403).json({
        message: "You do not have permission to manage this ticket",
      });
      return;
    }

    const ticket = await getTicketById(id);

    if (ticket.status !== "in_review") {
      res.status(400).json({
        message: "Only tickets in review can be resolved",
      });
      return;
    }

    const { resolution } = req.body;

    if (!resolution?.trim()) {
      res.status(400).json({
        message: "Resolution is required",
      });
      return;
    }

    const updatedTicket = await resolveTicket(id, {
      resolution: resolution.trim(),
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error("Failed to resolve ticket:", error);

    res.status(500).json({
      message: "Failed to resolve ticket",
    });
  }
};

export const deleteTicketHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    if (authenticatedRequest.role !== "admin") {
      res.status(403).json({
        message: "Only admins can delete tickets",
      });
      return;
    }

    await deleteTicket(id);

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete ticket:", error);

    res.status(500).json({
      message: "Failed to delete ticket",
    });
  }
};
