import "server-only";

import { createAnthropicProvider } from "./anthropic";
import { DevFallbackReasoningProvider } from "./dev-fallback";
import type { ReasoningProvider } from "./types";

export * from "./types";

let cached: ReasoningProvider | null = null;

/** Resolves the reasoning provider once per server process. */
export function getReasoningProvider(): ReasoningProvider {
  if (cached) return cached;
  cached = createAnthropicProvider() ?? new DevFallbackReasoningProvider();
  return cached;
}

export function resetReasoningProvider(): void {
  cached = null;
}
