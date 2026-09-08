import "server-only";

import { requireReasoningProvider, type ReasoningProvider } from "@/lib/llm";
import { requireResearchProvider, type ResearchProvider } from "@/lib/research";
import { ForecastError, type ForecastResult, type Stage } from "@/lib/types";
import { shortId, slugify } from "@/lib/utils";
import { applyStance, evaluateEvidence, gatherSources, readSources, MIN_USABLE_SOURCES } from "./evidence";
import { understandEvent, validateQuestion } from "./event";
import { generateNarrative } from "./generate";
import { calculateProbability } from "./probability";

/** Emitted as each stage begins, so the UI mirrors real backend progress. */
export type ProgressFn = (stage: Stage, detail?: string) => void;

export interface ForecastRequest {
  question: string;
  userId?: string | null;
  onProgress?: ProgressFn;
}

/**
 * The forecasting pipeline.
 *
 *   understandEvent      outcomes + base rates            (model)
 *   gatherSources        search, normalise, dedupe, rank  (research)
 *   readSources          fetch + extract real article text (research)
 *   evaluateEvidence     per-source judgement             (model)
 *   calculateProbability deterministic aggregation        (no model)
 *   generateNarrative    explanation of the number        (model)
 *
 * Providers are injected so the pipeline can be exercised against a stub in
 * tests without any offline fallback existing in the shipped product.
 */
export class ForecastEngine {
  private readonly research: ResearchProvider;
  private readonly reasoning: ReasoningProvider;

  constructor(research?: ResearchProvider, reasoning?: ReasoningProvider) {
    // Resolved lazily via require*Provider so an unconfigured deployment
    // surfaces a `not_configured` error rather than a silent fake forecast.
    this.research = research ?? requireResearchProvider();
    this.reasoning = reasoning ?? requireReasoningProvider();
  }

  async run({ question, userId = null, onProgress = () => {} }: ForecastRequest): Promise<ForecastResult> {
    const now = new Date();
    const cleanQuestion = validateQuestion(question);

    onProgress("understanding");
    const understanding = await understandEvent(cleanQuestion, this.reasoning, now);

    onProgress("researching", understanding.searchQueries[0]);
    const sources = await gatherSources(understanding, this.research, now);

    onProgress("researching", `reading ${sources.length} source${sources.length === 1 ? "" : "s"}`);
    const read = await readSources(sources, this.research);

    if (read.length < MIN_USABLE_SOURCES) {
      throw new ForecastError(
        "insufficient_evidence",
        "There isn't enough recent evidence to estimate this event responsibly.",
        "Predictly found some coverage but not enough to stand behind a number.",
      );
    }

    onProgress("analyzing", `${read.length} sources`);
    const assessed = await evaluateEvidence(understanding, read, this.reasoning);

    if (assessed.length < MIN_USABLE_SOURCES) {
      throw new ForecastError(
        "insufficient_evidence",
        "There isn't enough recent evidence to estimate this event responsibly.",
      );
    }

    const scored = calculateProbability(
      understanding.outcomes,
      understanding.priors,
      assessed,
      now,
    );

    const headline =
      scored.outcomes.find((outcome) => outcome.id === scored.headlineOutcomeId) ??
      scored.outcomes[0];
    if (!headline) throw new ForecastError("internal_error", "The engine produced no outcomes.");

    onProgress("forecasting");
    const narrative = await generateNarrative(understanding, headline, assessed, this.reasoning);

    onProgress("complete");

    return {
      id: shortId(),
      slug: slugify(cleanQuestion),
      question: cleanQuestion,
      normalizedEvent: understanding.normalizedEvent,
      category: understanding.category,
      outcomes: scored.outcomes,
      headlineOutcomeId: headline.id,
      outcome: headline.label,
      probability: headline.probability,
      confidence: scored.confidence,
      reasoning: narrative.reasoning,
      factorsFor: narrative.factorsUp,
      factorsAgainst: narrative.factorsDown,
      evidence: applyStance(assessed, headline.id),
      eventDate: understanding.resolutionDate,
      status: "complete",
      resolutionStatus: "unresolved",
      resolvedOutcomeId: null,
      resolutionSource: null,
      resolvedAt: null,
      researchedAt: now.toISOString(),
      createdAt: now.toISOString(),
      userId,
      providers: { research: this.research.name, reasoning: this.reasoning.name },
    };
  }
}
