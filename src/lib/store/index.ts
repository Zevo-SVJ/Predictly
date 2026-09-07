import "server-only";

import { createServerSupabase } from "@/lib/supabase/server";
import { MemoryPredictionStore } from "./memory";
import { SupabasePredictionStore } from "./supabase";
import type { PredictionStore } from "./types";

export * from "./types";

const memoryStore = new MemoryPredictionStore();

/**
 * Request-scoped store. Supabase when configured (so RLS applies to the calling
 * user), the in-memory store otherwise.
 */
export async function getPredictionStore(): Promise<PredictionStore> {
  const supabase = await createServerSupabase();
  return supabase ? new SupabasePredictionStore(supabase) : memoryStore;
}
