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

/** Terminal state of a forecast row. */
export type ForecastStatus = "complete" | "unresolved_error";

/** Which side of the question a source lands on. */
export type Stance = "supports" | "opposes" | "neutral";

/** A candidate answer to the user's question. */
export interface Outcome {
  /** Stable slug, e.g. "yes" / "no" / "kylian-mbappe". */
  id: string;
  /** Human label shown in the UI. */
  label: string;
  /** Final probability in [0, 1]. */
  probability: number;
}

/**
 * One researched source, after extraction and scoring.
 *
 * Every field here is derived from a document that was actually retrieved from
 * the web. Nothing in this shape is ever synthesised.
 */
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
  /** Stance relative to the forecast's headline outcome. */
  stance: Stance;
  /** How strongly it points there, 0–1. */
  strength: number;
  /** Source quality / independence, 0–1. */
  reliability: number;
  /** Topical relevance to the question, 0–1. */
  relevance: number;
}

export interface ForecastFactor {
  /** Short label, e.g. "Yamal has started every game of the campaign". */
  text: string;
  /** Weight of this factor on the final number, 0–1, used for the bar width. */
  weight: number;
}

/**
 * The complete, presentable forecast — the single contract shared by the
 * engine, the API, the database and every component.
 */
export interface ForecastResult {
  id: string;
  slug: string;
  question: string;
  /** The question restated unambiguously, with resolution criteria. */
  normalizedEvent: string;
  category: Category;
  outcomes: Outcome[];
  /** Id of the outcome with the highest probability. */
  headlineOutcomeId: string;
  /** Human label of that outcome, denormalised for convenience. */
  outcome: string;
  /** Probability of the headline outcome, 0–1. */
  probability: number;
  confidence: Confidence;
  /** Prose explanation grounded in the evidence below. */
  reasoning: string;
  factorsFor: ForecastFactor[];
  factorsAgainst: ForecastFactor[];
  evidence: EvidenceItem[];
  /** ISO date the event itself is expected to happen, when known. */
  eventDate: string | null;
  status: ForecastStatus;
  resolutionStatus: ResolutionStatus;
  resolvedOutcomeId: string | null;
  resolutionSource: string | null;
  /** ISO timestamp the forecast was resolved, if it has been. */
  resolvedAt: string | null;
  researchedAt: string;
  createdAt: string;
  userId: string | null;
  /** Which providers actually produced this forecast. Shown for transparency. */
  providers: { research: string; reasoning: string };
}

/** Reasons a forecast can legitimately fail. Each maps to a specific UI state. */
export type ForecastErrorCode =
  | "not_configured"
  | "malformed_question"
  | "not_about_future"
  | "ambiguous_event"
  | "no_search_results"
  | "insufficient_evidence"
  | "research_failed"
  | "provider_timeout"
  | "rate_limited"
  | "storage_failed"
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

/**
 * Pipeline stages, streamed to the client.
 *
 * The client never advances these on a timer — each one is emitted when the
 * server actually reaches it.
 */
export const STAGES = [
  "understanding",
  "researching",
  "analyzing",
  "forecasting",
  "complete",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABEL: Record<Stage, string> = {
  understanding: "Understanding the event",
  researching: "Searching recent sources",
  analyzing: "Weighing the evidence",
  forecasting: "Estimating the probability",
  complete: "Forecast ready",
};

/** Events streamed over NDJSON from `POST /api/predict`. */
export type ForecastStreamEvent =
  | { type: "stage"; stage: Stage; detail?: string }
  | { type: "result"; prediction: ForecastResult }
  | { type: "error"; code: ForecastErrorCode; message: string; hint?: string };
