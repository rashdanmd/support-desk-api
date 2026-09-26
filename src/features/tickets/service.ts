import { supabase } from "../../config/supabase";
import { CreateTicketData } from "./types";

export const getTickets = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

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
