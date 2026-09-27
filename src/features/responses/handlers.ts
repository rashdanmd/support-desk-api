import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../types/auth";
import { getTicketById } from "../tickets/service";

import { createTicketResponse, getTicketResponses } from "./service";

export const getTicketResponsesHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const ticketId = Number(req.params.ticketId);

    if (Number.isNaN(ticketId)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    const responses = await getTicketResponses(ticketId);

    res.json(responses);
  } catch (error) {
    console.error("Failed to get ticket responses:", error);

    res.status(500).json({
      message: "Failed to get ticket responses",
    });
  }
};

export const createTicketResponseHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const ticketId = Number(req.params.ticketId);

    if (Number.isNaN(ticketId)) {
      res.status(400).json({
        message: "Invalid ticket ID",
      });
      return;
    }

    const ticket = await getTicketById(ticketId);

    if (ticket.created_by !== authenticatedRequest.user.id) {
      res.status(403).json({
        message: "You can only respond to your own tickets",
      });
      return;
    }

    const { message } = req.body;

    if (!message?.trim()) {
      res.status(400).json({
        message: "Response message is required",
      });
      return;
    }

    const response = await createTicketResponse({
      ticketId,
      userId: authenticatedRequest.user.id,
      message: message.trim(),
    });

    res.status(201).json(response);
  } catch (error) {
    console.error("Failed to create ticket response:", error);

    res.status(500).json({
      message: "Failed to create ticket response",
    });
  }
};
