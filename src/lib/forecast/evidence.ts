import "server-only";

import {
  dedupeAndRank,
  normalizeResults,
  ResearchProviderError,
  type NormalizedSource,
  type ResearchProvider,
} from "@/lib/research";
import type { ReasoningProvider } from "@/lib/llm";
import { ForecastError, type EvidenceItem, type Stance } from "@/lib/types";
import { shortId, slugify } from "@/lib/utils";
import { EVALUATE_SYSTEM, renderSourceList } from "./prompts";
import { EvidenceAssessmentSchema } from "./schemas";
import type { EventUnderstanding } from "./schemas";
import { reason } from "./reason";

/** Sources actually read per forecast. A few good ones beat a wall of links. */
const MAX_SOURCES = 8;
const RESULTS_PER_QUERY = 6;
const MAX_QUERIES = 4;
/** Only consider material from roughly the last two years. */
const FRESHNESS_DAYS = 730;
/** Below this many usable sources the engine refuses rather than guesses. */
export const MIN_USABLE_SOURCES = 3;

/** A source whose full text has been retrieved. */
export interface ReadSource extends NormalizedSource {
  text: string;
}

/**
 * Step 2 — run the model's research queries, normalise, deduplicate and rank.
 */
export async function gatherSources(
  understanding: EventUnderstanding,
  research: ResearchProvider,
  now: Date,
): Promise<NormalizedSource[]> {
  const queries = understanding.searchQueries.slice(0, MAX_QUERIES);

  const batches = await Promise.allSettled(
    queries.map((query) =>
      research.search({ query, limit: RESULTS_PER_QUERY, freshnessDays: FRESHNESS_DAYS }),
    ),
  );

  const fulfilled = batches.filter((batch) => batch.status === "fulfilled");
  if (fulfilled.length === 0) {
    const firstRejection = batches.find((batch) => batch.status === "rejected");
    throw toForecastError(firstRejection?.reason);
  }

  const merged = fulfilled.flatMap((batch) => batch.value);
  const ranked = dedupeAndRank(normalizeResults(merged), now).slice(0, MAX_SOURCES);

  if (ranked.length === 0) {
    throw new ForecastError(
      "no_search_results",
      "Web research returned nothing usable for this event.",
      "Try naming the event more specifically, or ask about something with recent public coverage.",
    );
  }
  return ranked;
}

/**
 * Step 3 — retrieve the actual text of each source.
 *
 * A long provider snippet is already the article body, so this only fetches
 * what it has to. Sources that can't be read are dropped rather than guessed at.
 */
export async function readSources(
  sources: NormalizedSource[],
  research: ResearchProvider,
): Promise<ReadSource[]> {
  const read = await Promise.allSettled(
    sources.map(async (source): Promise<ReadSource> => {
      if (source.snippet.length >= 600) return { ...source, text: source.snippet };

      const extracted = await research.extract(await research.fetch(source.url));
      return {
        ...source,
        title: source.title || extracted.title,
        publishedAt: source.publishedAt ?? extracted.publishedAt,
        text: extracted.text.length > 200 ? extracted.text : source.snippet,
      };
    }),
  );

  return read
    .filter((entry) => entry.status === "fulfilled")
    .map((entry) => entry.value)
    .filter((source) => source.text.trim().length >= 120);
}

/**
 * Step 4 — judge each source on its own terms.
 *
 * The model scores relevance, reliability and strength per source and says
 * which outcome it points to. It never sees the running total, so it cannot
 * talk itself into a conclusion.
 */
export async function evaluateEvidence(
  understanding: EventUnderstanding,
  sources: ReadSource[],
  reasoning: ReasoningProvider,
): Promise<EvidenceItem[]> {
  const { assessments } = await reason(
    reasoning,
    {
      task: "evaluate",
      system: EVALUATE_SYSTEM,
      prompt: [
        `Question: ${understanding.normalizedEvent}`,
        `Outcomes: ${understanding.outcomes.map((o) => `${o.id} = ${o.label}`).join(" | ")}`,
        "",
        "Sources:",
        renderSourceList(sources),
      ].join("\n"),
      schema: EvidenceAssessmentSchema,
      input: {
        outcomes: understanding.outcomes,
        sources: sources.map((source, index) => ({
          index,
          title: source.title,
          snippet: source.text,
        })),
      },
      maxTokens: 8_000,
    },
    "weighing the evidence",
  );

  const validIds = new Set(understanding.outcomes.map((outcome) => outcome.id));

  return assessments
    .map((assessment): EvidenceItem | null => {
      const source = sources[assessment.sourceIndex];
      if (!source) return null;

      const supportsRaw = assessment.supportsOutcomeId
        ? slugify(assessment.supportsOutcomeId, 48)
        : null;
      const supportsOutcomeId = supportsRaw && validIds.has(supportsRaw) ? supportsRaw : null;

      return {
        id: shortId(8),
        title: source.title,
        url: source.url,
        sourceName: source.sourceName,
        publishedAt: source.publishedAt,
        summary: assessment.summary,
        supportsOutcomeId,
        // Provisional: rewritten against the headline outcome once it is known.
        stance: supportsOutcomeId ? "supports" : "neutral",
        strength: assessment.strength,
        reliability: assessment.reliability,
        relevance: assessment.relevance,
      };
    })
    .filter((item): item is EvidenceItem => item !== null)
    .sort((a, b) => b.relevance * b.reliability - a.relevance * a.reliability);
}

/**
 * Stance is relative to the outcome that actually won, so it can only be
 * assigned after the probability has been computed.
 */
export function applyStance(evidence: EvidenceItem[], headlineOutcomeId: string): EvidenceItem[] {
  return evidence.map((item) => ({
    ...item,
    stance: (item.supportsOutcomeId === null
      ? "neutral"
      : item.supportsOutcomeId === headlineOutcomeId
        ? "supports"
        : "opposes") satisfies Stance,
  }));
}

function toForecastError(reason: unknown): ForecastError {
  if (reason instanceof ResearchProviderError) {
    switch (reason.kind) {
      case "timeout":
        return new ForecastError("provider_timeout", "Web research timed out.", "Try again in a moment.");
      case "rate_limit":
        return new ForecastError("rate_limited", "The research provider is rate limiting us.", "Try again shortly.");
      case "unauthorized":
        return new ForecastError("not_configured", "The research provider rejected our credentials.", "Check TAVILY_API_KEY on the deployment.");
      default:
        break;
    }
  }
  return new ForecastError("research_failed", "Web research could not be completed.", "This is usually temporary.");
}
