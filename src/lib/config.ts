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

/** Trims a raw env value and treats blank as unset. */
function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Turns an env value into an absolute site URL, or `undefined` if it can't be
 * one.
 *
 * Vercel's host variables are bare hostnames (`my-app.vercel.app`), so a scheme
 * is added when missing. Anything that still fails to parse is rejected rather
 * than propagated: `new URL()` in `app/layout.tsx` must never be handed a value
 * that throws, which is what broke the Vercel build when
 * `NEXT_PUBLIC_SITE_URL` was defined but empty.
 */
function normaliseSiteUrl(value: string | undefined): string | undefined {
  const raw = clean(value);
  if (!raw) return undefined;

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    // Trailing slash removed so `${SITE.url}/sitemap.xml` never doubles up.
    // The pathname is kept: `metadataBase` may legitimately carry a base path.
    return url.href.replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}

/**
 * Resolves the canonical origin for metadata, canonical links, sitemap and
 * share URLs.
 *
 * Each `process.env.X` below is written as a literal member access on purpose:
 * that is the form Next.js statically replaces, so the `NEXT_PUBLIC_` entries
 * survive into the client bundle. Non-public variables simply read as
 * `undefined` there and the chain falls through.
 */
function resolveSiteUrl(): string {
  const isVercelProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  return (
    // 1. Explicit configuration always wins.
    normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    // 2. Vercel production: the project's stable domain. Deliberately not
    //    VERCEL_URL, which is unique per deployment and would point canonical
    //    URLs and og:url at a throwaway hostname on every deploy.
    (isVercelProduction
      ? (normaliseSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
        normaliseSiteUrl(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL))
      : undefined) ??
    // 3. Preview deployments: the deployment's own hostname is correct there.
    normaliseSiteUrl(process.env.VERCEL_URL) ??
    normaliseSiteUrl(process.env.NEXT_PUBLIC_VERCEL_URL) ??
    // 4. Local development and a local `next build`.
    "http://localhost:3000"
  );
}

export const SITE = {
  name: "Predictly",
  tagline: "Forecast What Happens Next",
  description:
    "Ask about any future event. Predictly researches the latest information and gives you a probability-based forecast.",
  /** Always a valid absolute URL with no trailing slash. Safe for `new URL()`. */
  url: resolveSiteUrl(),
} as const;

function env(name: string): string | undefined {
  return clean(process.env[name]);
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

/**
 * Browser-safe Supabase configuration.
 *
 * Supabase renamed the anon key to the publishable key; both names are read so
 * a project on either naming works. These are literal member accesses because
 * that is the form Next statically replaces in the client bundle.
 */
export const publicEnv = {
  supabaseUrl: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey:
    clean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
};

/** Supabase is optional in development; the app degrades to an in-memory store. */
export function isSupabaseConfigured(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}
