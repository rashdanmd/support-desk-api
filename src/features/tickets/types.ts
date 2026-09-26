export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus =
  | "pending"
  | "in_review"
  | "referred"
  | "resolved"
  | "closed"
  | "cancelled";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  teamId: number;
  affectedUrl: string | null;
  curl: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  assignedTo: string | null;
  resolution: string | null;
  referredTo: string | null;
  referralMessage: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  cancelledAt: string | null;
};

export type CreateTicketData = {
  title: string;
  description: string;
  teamId: number;
  affectedUrl?: string;
  curl?: string;
  priority?: TicketPriority;
  createdBy: string;
};
