import { supabase } from "../../config/supabase";
import {
  CreateTicketData,
  Ticket,
  UpdateTicketData,
  ReferTicketData,
  ResolveTicketData,
} from "./types";

export const getTickets = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      creator:profiles!tickets_created_by_fkey (
        id,
        display_name
      ),
      team:teams!tickets_team_id_fkey (
        id,
        name
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
      ),
      team:teams!tickets_team_id_fkey (
        id,
        name
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

export const updateTicket = async (
  id: number,
  updates: UpdateTicketData,
): Promise<Ticket> => {
  const { data, error } = await supabase
    .from("tickets")
    .update({
      title: updates.title,
      description: updates.description,
      team_id: updates.teamId,
      affected_url: updates.affectedUrl,
      curl: updates.curl,
      priority: updates.priority,
    })
    .eq("id", id)
    .select(
      `
      *,
      creator:profiles!tickets_created_by_fkey (
        id,
        display_name
      ),
      team:teams!tickets_team_id_fkey (
        id,
        name
      )
    `,
    )
    .single();

  if (error) throw error;

  return data;
};

export const cancelTicket = async (id: number): Promise<Ticket> => {
  const { data, error } = await supabase
    .from("tickets")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      `
      *,
      creator:profiles!tickets_created_by_fkey (
        id,
        display_name
      ),
      team:teams!tickets_team_id_fkey (
        id,
        name
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const startTicketReview = async (id: number): Promise<Ticket> => {
  const { data, error } = await supabase
    .from("tickets")
    .update({
      status: "in_review",
    })
    .eq("id", id)
    .select(
      `
      *,
      creator:profiles!tickets_created_by_fkey (
        id,
        display_name
      ),
      team:teams!tickets_team_id_fkey (
        id,
        name
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const referTicket = async (
  id: number,
  referralData: ReferTicketData,
): Promise<Ticket> => {
  const { data, error } = await supabase
    .from("tickets")
    .update({
      status: "referred",
      referral_message: referralData.message,
    })
    .eq("id", id)
    .select(
      `
      *,
      creator:profiles!tickets_created_by_fkey (
        id,
        display_name
      ),
      team:teams!tickets_team_id_fkey (
        id,
        name
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const resolveTicket = async (
  id: number,
  resolveData: ResolveTicketData,
): Promise<Ticket> => {
  const { data, error } = await supabase
    .from("tickets")
    .update({
      status: "resolved",
      resolution: resolveData.resolution,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      `
      *,
      creator:profiles!tickets_created_by_fkey (
        id,
        display_name
      ),
      team:teams!tickets_team_id_fkey (
        id,
        name
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteTicket = async (id: number): Promise<void> => {
  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (error) {
    throw error;
  }
};
