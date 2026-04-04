import { createClient, SupabaseClient } from "@supabase/supabase-js";

let service: SupabaseClient | null = null;

/**
 * Server-only Supabase client with service role — never import in client components.
 */
export function getSupabaseService(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!service) {
    service = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return service;
}

export function hasSupabaseService(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
