import "server-only";

import {
  ReasoningProviderError,
  type ReasoningProvider,
  type ReasoningRequest,
} from "@/lib/llm";
import { ForecastError } from "@/lib/types";

/**
 * Runs one reasoning step, translating provider failures into forecast errors
 * the UI knows how to explain.
 */
export async function reason<T>(
  provider: ReasoningProvider,
  request: ReasoningRequest<T>,
  what: string,
): Promise<T> {
  try {
    return await provider.run<T>(request);
  } catch (error) {
    if (error instanceof ReasoningProviderError) {
      switch (error.kind) {
        case "timeout":
          throw new ForecastError("provider_timeout", `Timed out while ${what}.`);
        case "rate_limit":
          throw new ForecastError("rate_limited", "Predictly is at capacity right now.", "Give it a minute and try again.");
        case "unauthorized":
          throw new ForecastError("not_configured", "The reasoning provider rejected our credentials.", "Check ANTHROPIC_API_KEY on the deployment.");
        default:
          break;
      }
    }
    throw new ForecastError("internal_error", `Something went wrong while ${what}.`);
  }
}
