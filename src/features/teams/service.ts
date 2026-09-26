import { supabase } from "../../config/supabase.js";

export const getTeams = async () => {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  return data;
};
