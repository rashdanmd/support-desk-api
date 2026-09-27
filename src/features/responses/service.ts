import { supabase } from "../../config/supabase";

import type { CreateTicketResponseData, TicketResponse } from "./types";

export const getTicketResponses = async (
  ticketId: number,
): Promise<TicketResponse[]> => {
  const { data, error } = await supabase
    .from("ticket_responses")
    .select(
      `
      *,
      author:profiles!ticket_responses_user_id_fkey (
        id,
        display_name
      )
    `,
    )
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

export const createTicketResponse = async (
  responseData: CreateTicketResponseData,
): Promise<TicketResponse> => {
  const { data, error } = await supabase
    .from("ticket_responses")
    .insert({
      ticket_id: responseData.ticketId,
      user_id: responseData.userId,
      message: responseData.message,
    })
    .select(
      `
      *,
      author:profiles!ticket_responses_user_id_fkey (
        id,
        display_name
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
};
