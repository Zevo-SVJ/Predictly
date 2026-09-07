import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv, serverEnv } from "@/lib/config";

/** Request-scoped Supabase client that reads and refreshes the auth cookie. */
export async function createServerSupabase() {
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) return null;
  const cookieStore = await cookies();

  return createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component; the middleware refreshes the session.
        }
      },
    },
  });
}

/**
 * Service-role client for writes that must bypass RLS — currently only the
 * admin resolution path. Never expose the key or this client to the browser.
 */
export function createAdminSupabase() {
  const key = serverEnv.supabaseServiceRoleKey();
  if (!publicEnv.supabaseUrl || !key) return null;
  return createServerClient(publicEnv.supabaseUrl, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

/** The signed-in user, or null. Safe to call when Supabase isn't configured. */
export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}
