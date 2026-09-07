"use client";

import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/config";

/**
 * Browser Supabase client. Returns null when Supabase isn't configured so the
 * app still runs locally; callers must handle that case in the UI.
 */
export function createClient() {
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) return null;
  return createBrowserClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey);
}
