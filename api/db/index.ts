import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.DATABASE_URL || "";
const supabaseKey = process.env.API_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("DATABASE_URL and API_KEY must be provided");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
