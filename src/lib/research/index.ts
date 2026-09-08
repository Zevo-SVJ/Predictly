import "server-only";

import { serverEnv } from "@/lib/config";
import { ForecastError } from "@/lib/types";
import { createBraveProvider } from "./brave";
import { createTavilyProvider } from "./tavily";
import type { ResearchProvider } from "./provider";

export * from "./provider";
export { assertFetchableUrl } from "./safe-fetch";
export { sourceNameFromUrl } from "./html";
export { normalizeResults, canonicalise, type NormalizedSource } from "./normalize";
export { dedupeAndRank } from "./dedupe";

let cached: ResearchProvider | null = null;

/**
 * Resolves the research provider, or explains why it can't.
 *
 * There is deliberately no offline fallback. A forecast without real research
 * is not a forecast, and a plausible-looking one built from fixtures is worse
 * than no answer at all — so when no key is configured this throws and the user
 * is told the deployment is unconfigured.
 */
export function requireResearchProvider(): ResearchProvider {
  if (cached) return cached;

  const preferred = serverEnv.researchProvider()?.toLowerCase();
  const factories: Record<string, () => ResearchProvider | null> = {
    tavily: createTavilyProvider,
    brave: createBraveProvider,
  };

  const provider =
    (preferred ? factories[preferred]?.() : null) ??
    createTavilyProvider() ??
    createBraveProvider();

  if (!provider) {
    throw new ForecastError(
      "not_configured",
      "Predictly has no web research provider configured.",
      "Set TAVILY_API_KEY (or BRAVE_SEARCH_API_KEY) on the deployment. Predictly will not guess without sources.",
    );
  }

  cached = provider;
  return provider;
}

/** True when a research provider is available. Used for health reporting. */
export function isResearchConfigured(): boolean {
  return Boolean(serverEnv.tavilyApiKey() ?? serverEnv.braveApiKey());
}

/** Test seam: drop the memoised provider. */
export function resetResearchProvider(): void {
  cached = null;
}
