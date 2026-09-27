export type TicketResponse = {
  id: number;
  ticket_id: number;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;

  author: {
    id: string;
    display_name: string;
  };
};

export type CreateTicketResponseData = {
  ticketId: number;
  userId: string;
  message: string;
};
