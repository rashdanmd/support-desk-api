import { supabase } from "../config/supabase.js";

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
