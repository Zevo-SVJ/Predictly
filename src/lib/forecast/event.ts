import "server-only";

import type { ReasoningProvider } from "@/lib/llm";
import { ForecastError } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { UNDERSTAND_SYSTEM } from "./prompts";
import { EventUnderstandingSchema, type EventUnderstanding } from "./schemas";
import { reason } from "./reason";

/** Cheap structural checks before spending a model call. */
export function validateQuestion(question: string): string {
  const trimmed = question.trim().replace(/\s+/g, " ");

  if (trimmed.length < 8 || !/[a-z]{3}/i.test(trimmed)) {
    throw new ForecastError(
      "malformed_question",
      "That doesn't look like a question about an event.",
      "Try something like “Who will win the 2026 Ballon d’Or?”",
    );
  }
  if (trimmed.length > 240) {
    throw new ForecastError(
      "malformed_question",
      "That question is too long to forecast reliably.",
      "Trim it to a single, specific future event.",
    );
  }
  return trimmed;
}

/**
 * Step 1 — turn free text into a well-posed forecasting problem: outcomes,
 * base rates from the reference class, an expected event date, and the search
 * queries a researcher would actually run.
 */
export async function understandEvent(
  question: string,
  reasoning: ReasoningProvider,
  now: Date,
): Promise<EventUnderstanding> {
  const understanding = await reason(
    reasoning,
    {
      task: "understand",
      system: UNDERSTAND_SYSTEM,
      prompt: `Today is ${now.toISOString().slice(0, 10)}.\n\nUser question:\n${question}`,
      schema: EventUnderstandingSchema,
      input: { question, today: now.toISOString().slice(0, 10) },
      maxTokens: 4_000,
    },
    "understanding the event",
  );

  if (understanding.quality === "malformed") {
    throw new ForecastError("malformed_question", understanding.qualityNote, "Rephrase it as a question about a specific future event.");
  }
  if (understanding.quality === "not_future") {
    throw new ForecastError("not_about_future", understanding.qualityNote, "Predictly forecasts events that haven't happened yet.");
  }
  if (understanding.quality === "ambiguous") {
    throw new ForecastError("ambiguous_event", understanding.qualityNote, "Add a deadline, or say what would count as it happening.");
  }

  return normaliseOutcomeIds(understanding);
}

/** Model-chosen outcome ids are slugified so every downstream map lines up. */
function normaliseOutcomeIds(understanding: EventUnderstanding): EventUnderstanding {
  const outcomes = understanding.outcomes.map((outcome) => ({
    ...outcome,
    id: slugify(outcome.id, 48),
  }));
  const validIds = new Set(outcomes.map((outcome) => outcome.id));

  return {
    ...understanding,
    outcomes,
    priors: understanding.priors
      .map((prior) => ({ ...prior, outcomeId: slugify(prior.outcomeId, 48) }))
      .filter((prior) => validIds.has(prior.outcomeId)),
  };
}
