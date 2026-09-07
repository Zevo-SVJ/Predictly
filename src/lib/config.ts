/**
 * Central runtime configuration for Predictly.
 *
 * Everything that could plausibly change per-deployment (providers, feature
 * gates, launch dates) lives here so the rest of the app never reads
 * `process.env` directly.
 */

/**
 * Launch-period product decision: Predictly is entirely free until this date.
 * No Stripe, no tiers, no pricing UI. The flag exists so a future usage/billing
 * layer can be added by flipping `FREE_MODE` and implementing `lib/billing`,
 * without rewriting the prediction pipeline.
 */
export const FREE_MODE = true;

/** End of the free launch period. */
export const FREE_MODE_UNTIL = new Date("2026-09-22T23:59:59Z");

/** Anonymous visitors may run this many forecasts per rate-limit window. */
export const ANON_FORECASTS_PER_WINDOW = 5;
/** Signed-in users get a larger allowance. */
export const USER_FORECASTS_PER_WINDOW = 20;
/** Rate-limit window length in milliseconds. */
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export const SITE = {
  name: "Predictly",
  tagline: "Forecast What Happens Next",
  description:
    "Ask about any future event. Predictly researches the latest information and gives you a probability-based forecast.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

/** Server-only provider credentials. Never import this from a client component. */
export const serverEnv = {
  tavilyApiKey: () => env("TAVILY_API_KEY"),
  braveApiKey: () => env("BRAVE_SEARCH_API_KEY"),
  anthropicApiKey: () => env("ANTHROPIC_API_KEY"),
  anthropicModel: () => env("ANTHROPIC_MODEL") ?? "claude-opus-5",
  supabaseServiceRoleKey: () => env("SUPABASE_SERVICE_ROLE_KEY"),
  researchProvider: () => env("RESEARCH_PROVIDER"),
};

export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

/** Supabase is optional in development; the app degrades to an in-memory store. */
export function isSupabaseConfigured(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}
