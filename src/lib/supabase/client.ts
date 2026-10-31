import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { readSupabaseConfiguration } from "./configuration";

export const supabaseConfiguration = readSupabaseConfiguration(import.meta.env);
let client: SupabaseClient<Database> | undefined;

export function getSupabase(): SupabaseClient<Database> {
  if (supabaseConfiguration.status !== "ready")
    throw new Error(supabaseConfiguration.message);
  client ??= createClient<Database>(
    supabaseConfiguration.url,
    supabaseConfiguration.publishableKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
  return client;
}
