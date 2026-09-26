import { supabase } from "../../config/supabase";
import { CreateTicketData, Ticket } from "./types";

export const getTickets = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      creator:profiles!tickets_created_by_fkey (
        id,
        display_name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const getTicketById = async (id: number): Promise<Ticket> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      creator:profiles!tickets_created_by_fkey (
        id,
        display_name
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createTicket = async ({
  title,
  description,
  teamId,
  affectedUrl,
  curl,
  priority = "medium",
  createdBy,
}: CreateTicketData) => {
  const { data, error } = await supabase
    .from("tickets")
    .insert({
      title,
      description,
      team_id: teamId,
      affected_url: affectedUrl,
      curl,
      priority,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
