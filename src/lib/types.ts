/** Shared domain types for the Predictly forecasting pipeline. */

export const CATEGORIES = [
  "Sports",
  "Politics",
  "Technology",
  "Gaming",
  "Entertainment",
  "Business",
  "Finance",
  "Crypto",
  "Science",
  "Culture",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** How much we trust the forecast itself — distinct from the event probability. */
export type Confidence = "low" | "medium" | "high";

export type ResolutionStatus = "unresolved" | "correct" | "wrong" | "cancelled";

/** A candidate answer to the user's question. */
export interface Outcome {
  /** Stable slug, e.g. "yes" / "no" / "real-madrid". */
  id: string;
  /** Human label shown in the UI. */
  label: string;
  /** Final probability in [0, 1]. */
  probability: number;
}

/** One researched source, after extraction and scoring. */
export interface EvidenceItem {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  publishedAt: string | null;
  /** Short, factual summary of what this source actually says. */
  summary: string;
  /** Which outcome this evidence points toward, by outcome id. */
  supportsOutcomeId: string | null;
  /** How strongly it points there, 0–1. */
  strength: number;
  /** Source quality / independence, 0–1. */
  reliability: number;
  /** Topical relevance to the question, 0–1. */
  relevance: number;
  /** True when produced by the development fallback rather than real research. */
  isDevFallback: boolean;
}

export interface ForecastFactor {
  /** Short label, e.g. "Rockstar has delayed every major title since 2013". */
  text: string;
  /** Weight of this factor on the final number, 0–1, used for the bar width. */
  weight: number;
}

/** The full, presentable forecast. */
export interface Forecast {
  id: string;
  slug: string;
  question: string;
  /** The question restated unambiguously, with resolution criteria. */
  normalizedEvent: string;
  category: Category;
  outcomes: Outcome[];
  /** Id of the outcome with the highest probability. */
  headlineOutcomeId: string;
  /** Probability of the headline outcome, 0–1. */
  probability: number;
  confidence: Confidence;
  /** Prose explanation grounded in the evidence below. */
  reasoning: string;
  factorsUp: ForecastFactor[];
  factorsDown: ForecastFactor[];
  evidence: EvidenceItem[];
  /** ISO date the event is expected to resolve, when known. */
  resolutionDate: string | null;
  resolutionStatus: ResolutionStatus;
  resolvedOutcomeId: string | null;
  resolutionSource: string | null;
  resolvedAt: string | null;
  researchedAt: string;
  createdAt: string;
  userId: string | null;
  /** True when any part of the pipeline ran on a development fallback. */
  isDevFallback: boolean;
  /** Named providers actually used, surfaced in the UI for honesty. */
  providers: { research: string; reasoning: string };
}

/** Reasons a forecast can legitimately fail. Each maps to a specific UI state. */
export type ForecastErrorCode =
  | "malformed_question"
  | "not_about_future"
  | "ambiguous_event"
  | "insufficient_evidence"
  | "research_failed"
  | "provider_timeout"
  | "rate_limited"
  | "internal_error";

export class ForecastError extends Error {
  constructor(
    readonly code: ForecastErrorCode,
    message: string,
    readonly hint?: string,
  ) {
    super(message);
    this.name = "ForecastError";
  }
}

/** Pipeline stages, streamed to the client so the loading UI reflects reality. */
export const STAGES = [
  "understanding",
  "searching",
  "reading",
  "weighing",
  "forecasting",
  "done",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABEL: Record<Stage, string> = {
  understanding: "Understanding the event",
  searching: "Searching recent sources",
  reading: "Reading what was found",
  weighing: "Comparing evidence",
  forecasting: "Estimating probabilities",
  done: "Forecast ready",
};

/** Events streamed over NDJSON from `POST /api/forecast`. */
export type ForecastStreamEvent =
  | { type: "stage"; stage: Stage; detail?: string }
  | { type: "sources"; count: number }
  | { type: "result"; forecast: Forecast }
  | { type: "error"; code: ForecastErrorCode; message: string; hint?: string };
