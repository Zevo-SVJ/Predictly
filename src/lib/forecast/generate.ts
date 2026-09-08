import "server-only";

import type { ReasoningProvider } from "@/lib/llm";
import type { EvidenceItem, Outcome } from "@/lib/types";
import { NARRATE_SYSTEM } from "./prompts";
import { ForecastNarrativeSchema, type ForecastNarrative } from "./schemas";
import type { EventUnderstanding } from "./schemas";
import { reason } from "./reason";

/**
 * Step 5 — explain a probability that has already been computed.
 *
 * The number is passed in, not requested. The model's only job is to say why
 * the evidence produced it, which keeps the explanation tied to the sources
 * rather than to a separate guess.
 */
export async function generateNarrative(
  understanding: EventUnderstanding,
  headline: Outcome,
  evidence: EvidenceItem[],
  reasoning: ReasoningProvider,
): Promise<ForecastNarrative> {
  return reason(
    reasoning,
    {
      task: "narrate",
      system: NARRATE_SYSTEM,
      prompt: [
        `Question: ${understanding.normalizedEvent}`,
        `Computed probability: ${Math.round(headline.probability * 100)}% for "${headline.label}".`,
        `Base-rate rationale: ${understanding.priorRationale}`,
        "",
        "Evidence considered:",
        ...evidence.map(
          (item) =>
            `- [${item.supportsOutcomeId ?? "neutral"}] ${item.sourceName}` +
            `${item.publishedAt ? ` (${item.publishedAt.slice(0, 10)})` : ""}: ${item.summary}`,
        ),
      ].join("\n"),
      schema: ForecastNarrativeSchema,
      input: {
        normalizedEvent: understanding.normalizedEvent,
        headlineLabel: headline.label,
        headlineOutcomeId: headline.id,
        probability: headline.probability,
        evidence: evidence.map((item) => ({
          summary: item.summary,
          supportsOutcomeId: item.supportsOutcomeId,
        })),
      },
      maxTokens: 4_000,
    },
    "writing the forecast",
  );
}
