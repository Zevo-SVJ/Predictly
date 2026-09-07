import "server-only";

import { getReasoningProvider, ReasoningProviderError } from "@/lib/llm";
import {
  getResearchProvider,
  ResearchProviderError,
  sourceNameFromUrl,
  type ResearchProvider,
  type SearchResult,
} from "@/lib/research";
import { shortId, slugify } from "@/lib/utils";
import {
  ForecastError,
  type EvidenceItem,
  type Forecast,
  type Stage,
} from "@/lib/types";
import { calculateProbability, MIN_USABLE_SOURCES } from "./probability";
import {
  EvidenceAssessmentSchema,
  EventUnderstandingSchema,
  ForecastNarrativeSchema,
  type EventUnderstanding,
} from "./schemas";
import { EVALUATE_SYSTEM, NARRATE_SYSTEM, renderSourceList, UNDERSTAND_SYSTEM } from "./prompts";

/** Emitted as each pipeline stage begins, so the UI mirrors real progress. */
export type ProgressFn = (stage: Stage, detail?: string) => void;

/** Sources actually read per forecast. Small and high quality beats many. */
const MAX_SOURCES = 8;
/** Extra results fetched before dedup and trimming. */
const SEARCH_LIMIT_PER_QUERY = 6;
/** Only consider evidence from roughly the last two years. */
const FRESHNESS_DAYS = 730;

export interface ForecastRequest {
  question: string;
  userId?: string | null;
  onProgress?: ProgressFn;
}

/**
 * ForecastEngine — the five-step pipeline.
 *
 *   understandEvent  → a well-posed question, outcomes and base rates
 *   gatherEvidence   → real web search, deduplicated and freshness-aware
 *   evaluateEvidence → per-source judgement (model)
 *   calculateProbability → deterministic aggregation (no model)
 *   generateForecast → explanation of the computed number (model)
 *
 * Research, forecasting and presentation stay separate: this class returns a
 * plain `Forecast` and knows nothing about React, routes or storage.
 */
export class ForecastEngine {
  constructor(
    private readonly research: ResearchProvider = getResearchProvider(),
    private readonly reasoning = getReasoningProvider(),
  ) {}

  async run({ question, userId = null, onProgress = () => {} }: ForecastRequest): Promise<Forecast> {
    const now = new Date();

    onProgress("understanding");
    const understanding = await this.understandEvent(question, now);

    onProgress("searching", understanding.searchQueries[0]);
    const results = await this.gatherEvidence(understanding);

    onProgress("reading", `${results.length} source${results.length === 1 ? "" : "s"}`);
    const documents = await this.readSources(results);

    if (documents.length < MIN_USABLE_SOURCES) {
      throw new ForecastError(
        "insufficient_evidence",
        "Not enough usable sources were found for this event.",
        "Try naming the event more specifically, or ask about something with recent public coverage.",
      );
    }

    onProgress("weighing", `${documents.length} sources`);
    const evidence = await this.evaluateEvidence(understanding, documents);

    const scored = calculateProbability(
      understanding.outcomes,
      understanding.priors,
      evidence,
      now,
    );

    onProgress("forecasting");
    const headline =
      scored.outcomes.find((o) => o.id === scored.headlineOutcomeId) ?? scored.outcomes[0];
    if (!headline) {
      throw new ForecastError("internal_error", "The engine produced no outcomes.");
    }

    const narrative = await this.generateForecast(understanding, headline, scored.probability, evidence);

    onProgress("done");

    const isDevFallback = this.research.isDevFallback || this.reasoning.isDevFallback;

    return {
      id: shortId(),
      slug: slugify(question),
      question: question.trim(),
      normalizedEvent: understanding.normalizedEvent,
      category: understanding.category,
      outcomes: scored.outcomes,
      headlineOutcomeId: headline.id,
      probability: scored.probability,
      confidence: scored.confidence,
      reasoning: narrative.reasoning,
      factorsUp: narrative.factorsUp,
      factorsDown: narrative.factorsDown,
      evidence,
      resolutionDate: understanding.resolutionDate,
      resolutionStatus: "unresolved",
      resolvedOutcomeId: null,
      resolutionSource: null,
      resolvedAt: null,
      researchedAt: now.toISOString(),
      createdAt: now.toISOString(),
      userId,
      isDevFallback,
      providers: { research: this.research.name, reasoning: this.reasoning.name },
    };
  }

  // ---------------------------------------------------------------- step 1

  private async understandEvent(question: string, now: Date): Promise<EventUnderstanding> {
    const trimmed = question.trim();
    if (trimmed.length < 8 || !/[a-z]{3}/i.test(trimmed)) {
      throw new ForecastError(
        "malformed_question",
        "That doesn't look like a question about an event.",
        "Try something like “Will GTA VI be delayed again?”",
      );
    }

    const understanding = await this.reason(
      {
        task: "understand",
        system: UNDERSTAND_SYSTEM,
        prompt: `Today is ${now.toISOString().slice(0, 10)}.\n\nUser question:\n${trimmed}`,
        schema: EventUnderstandingSchema,
        input: { question: trimmed, today: now.toISOString().slice(0, 10) },
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
      throw new ForecastError("ambiguous_event", understanding.qualityNote, "Add a deadline or say what would count as it happening.");
    }

    // Normalise outcome ids so downstream maps line up regardless of model output.
    understanding.outcomes = understanding.outcomes.map((outcome) => ({
      ...outcome,
      id: slugify(outcome.id, 48),
    }));
    const validIds = new Set(understanding.outcomes.map((o) => o.id));
    understanding.priors = understanding.priors
      .map((prior) => ({ ...prior, outcomeId: slugify(prior.outcomeId, 48) }))
      .filter((prior) => validIds.has(prior.outcomeId));

    return understanding;
  }

  // ---------------------------------------------------------------- step 2

  private async gatherEvidence(understanding: EventUnderstanding): Promise<SearchResult[]> {
    const queries = understanding.searchQueries.slice(0, 4);

    const batches = await Promise.allSettled(
      queries.map((query) =>
        this.research.search({
          query,
          limit: SEARCH_LIMIT_PER_QUERY,
          freshnessDays: FRESHNESS_DAYS,
        }),
      ),
    );

    const succeeded = batches.filter((b) => b.status === "fulfilled");
    if (succeeded.length === 0) {
      const reason = batches[0];
      if (reason?.status === "rejected" && reason.reason instanceof ResearchProviderError) {
        throw toForecastError(reason.reason);
      }
      throw new ForecastError("research_failed", "Web research could not be completed.");
    }

    const merged = succeeded.flatMap((b) => b.value);
    return rankAndDedupe(merged).slice(0, MAX_SOURCES);
  }

  /** Fetches and extracts anything the search provider didn't already give us. */
  private async readSources(results: SearchResult[]) {
    const read = await Promise.allSettled(
      results.map(async (result) => {
        // A long provider snippet is usually the article body already.
        if (result.snippet.length >= 600) {
          return {
            url: result.url,
            title: result.title,
            sourceName: sourceNameFromUrl(result.url),
            publishedAt: result.publishedAt,
            text: result.snippet,
          };
        }
        const extracted = await this.research.extract(await this.research.fetch(result.url));
        return {
          url: result.url,
          title: extracted.title || result.title,
          sourceName: sourceNameFromUrl(result.url),
          publishedAt: result.publishedAt ?? extracted.publishedAt,
          text: extracted.text.length > 200 ? extracted.text : result.snippet,
        };
      }),
    );

    return read
      .filter((entry) => entry.status === "fulfilled")
      .map((entry) => entry.value)
      .filter((doc) => doc.text.trim().length >= 120);
  }

  // ---------------------------------------------------------------- step 3

  private async evaluateEvidence(
    understanding: EventUnderstanding,
    documents: Awaited<ReturnType<ForecastEngine["readSources"]>>,
  ): Promise<EvidenceItem[]> {
    const { assessments } = await this.reason(
      {
        task: "evaluate",
        system: EVALUATE_SYSTEM,
        prompt: [
          `Question: ${understanding.normalizedEvent}`,
          `Outcomes: ${understanding.outcomes.map((o) => `${o.id} = ${o.label}`).join(" | ")}`,
          "",
          "Sources:",
          renderSourceList(documents),
        ].join("\n"),
        schema: EvidenceAssessmentSchema,
        input: {
          outcomes: understanding.outcomes,
          sources: documents.map((doc, index) => ({
            index,
            title: doc.title,
            snippet: doc.text,
          })),
        },
        maxTokens: 8_000,
      },
      "weighing the evidence",
    );

    const validIds = new Set(understanding.outcomes.map((o) => o.id));

    return assessments
      .map((assessment) => {
        const doc = documents[assessment.sourceIndex];
        if (!doc) return null;
        const supports = assessment.supportsOutcomeId
          ? slugify(assessment.supportsOutcomeId, 48)
          : null;

        return {
          id: shortId(8),
          title: doc.title,
          url: doc.url,
          sourceName: doc.sourceName,
          publishedAt: doc.publishedAt,
          summary: assessment.summary,
          supportsOutcomeId: supports && validIds.has(supports) ? supports : null,
          strength: assessment.strength,
          reliability: assessment.reliability,
          relevance: assessment.relevance,
          isDevFallback: this.research.isDevFallback,
        } satisfies EvidenceItem;
      })
      .filter((item): item is EvidenceItem => item !== null)
      .sort((a, b) => b.relevance * b.reliability - a.relevance * a.reliability);
  }

  // ---------------------------------------------------------------- step 5

  private async generateForecast(
    understanding: EventUnderstanding,
    headline: { id: string; label: string },
    probability: number,
    evidence: EvidenceItem[],
  ) {
    return this.reason(
      {
        task: "narrate",
        system: NARRATE_SYSTEM,
        prompt: [
          `Question: ${understanding.normalizedEvent}`,
          `Computed probability: ${Math.round(probability * 100)}% for "${headline.label}".`,
          `Base-rate rationale: ${understanding.priorRationale}`,
          "",
          "Evidence considered:",
          ...evidence.map(
            (item) =>
              `- [${item.supportsOutcomeId ?? "neutral"}] ${item.sourceName}: ${item.summary}`,
          ),
        ].join("\n"),
        schema: ForecastNarrativeSchema,
        input: {
          normalizedEvent: understanding.normalizedEvent,
          headlineLabel: headline.label,
          headlineOutcomeId: headline.id,
          probability,
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

  // ------------------------------------------------------------------ util

  private async reason<T>(
    request: Parameters<typeof this.reasoning.run<T>>[0],
    what: string,
  ): Promise<T> {
    try {
      return await this.reasoning.run<T>(request);
    } catch (error) {
      if (error instanceof ReasoningProviderError) {
        if (error.kind === "timeout") {
          throw new ForecastError("provider_timeout", `Timed out while ${what}.`);
        }
        if (error.kind === "rate_limit") {
          throw new ForecastError("rate_limited", "Predictly is at capacity right now.", "Give it a minute and try again.");
        }
      }
      throw new ForecastError("internal_error", `Something went wrong while ${what}.`);
    }
  }
}

function toForecastError(error: ResearchProviderError): ForecastError {
  switch (error.kind) {
    case "timeout":
      return new ForecastError("provider_timeout", "Web research timed out.");
    case "rate_limit":
      return new ForecastError("rate_limited", "The research provider is rate limiting us.", "Try again shortly.");
    default:
      return new ForecastError("research_failed", "Web research could not be completed.");
  }
}

/**
 * Deduplicates by canonical URL and near-identical headline, then ranks by
 * provider score with a bonus for anything published recently.
 */
export function rankAndDedupe(results: SearchResult[]): SearchResult[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const unique: SearchResult[] = [];

  for (const result of results) {
    const canonicalUrl = canonicalise(result.url);
    const canonicalTitle = result.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!canonicalUrl || seenUrls.has(canonicalUrl) || seenTitles.has(canonicalTitle)) continue;
    seenUrls.add(canonicalUrl);
    if (canonicalTitle) seenTitles.add(canonicalTitle);
    unique.push(result);
  }

  const now = Date.now();
  return unique.sort((a, b) => scoreResult(b, now) - scoreResult(a, now));
}

function scoreResult(result: SearchResult, now: number): number {
  const base = result.score ?? 0.5;
  if (!result.publishedAt) return base;
  const ageDays = (now - new Date(result.publishedAt).getTime()) / 86_400_000;
  if (Number.isNaN(ageDays)) return base;
  return base + 0.3 * Math.pow(0.5, Math.max(0, ageDays) / 60);
}

function canonicalise(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl, "https://predictly.local");
    url.hash = "";
    url.search = "";
    return `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}
