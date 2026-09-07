import "server-only";

import { serverEnv } from "@/lib/config";
import { createBraveProvider } from "./brave";
import { DevFallbackResearchProvider } from "./dev-fallback";
import { createTavilyProvider } from "./tavily";
import type { ResearchProvider } from "./types";

export * from "./types";
export { assertFetchableUrl } from "./safe-fetch";
export { sourceNameFromUrl } from "./html";

let cached: ResearchProvider | null = null;

/**
 * Resolves the research provider once per server process.
 *
 * Order: explicit `RESEARCH_PROVIDER` override, then whichever key is present,
 * then the development fallback. Adding a provider means adding a factory here
 * and nothing else.
 */
export function getResearchProvider(): ResearchProvider {
  if (cached) return cached;

  const preferred = serverEnv.researchProvider()?.toLowerCase();
  const factories: Record<string, () => ResearchProvider | null> = {
    tavily: createTavilyProvider,
    brave: createBraveProvider,
    "dev-fallback": () => new DevFallbackResearchProvider(),
  };

  if (preferred) {
    const provider = factories[preferred]?.();
    if (provider) return (cached = provider);
  }

  cached = createTavilyProvider() ?? createBraveProvider() ?? new DevFallbackResearchProvider();
  return cached;
}

/** Test seam: drop the memoised provider. */
export function resetResearchProvider(): void {
  cached = null;
}
