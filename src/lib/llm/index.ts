import "server-only";

import { serverEnv } from "@/lib/config";
import { ForecastError } from "@/lib/types";
import { createAnthropicProvider } from "./anthropic";
import type { ReasoningProvider } from "./types";

export * from "./types";

let cached: ReasoningProvider | null = null;

/**
 * Resolves the reasoning provider, or explains why it can't.
 *
 * As with research, there is no offline substitute: a locally-invented
 * probability would look identical to a researched one in the UI, which is
 * precisely the confusion this product must never create.
 */
export function requireReasoningProvider(): ReasoningProvider {
  if (cached) return cached;

  const provider = createAnthropicProvider();
  if (!provider) {
    throw new ForecastError(
      "not_configured",
      "Predictly has no reasoning provider configured.",
      "Set ANTHROPIC_API_KEY on the deployment.",
    );
  }

  cached = provider;
  return provider;
}

export function isReasoningConfigured(): boolean {
  return Boolean(serverEnv.anthropicApiKey());
}

export function resetReasoningProvider(): void {
  cached = null;
}
