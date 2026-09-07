import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, Confidence, EvidenceItem, Forecast, Outcome, ResolutionStatus } from "@/lib/types";
import type { PredictionStore, ResolutionInput } from "./types";

/** Row shapes mirroring `supabase/schema.sql`. */
interface PredictionRow {
  id: string;
  user_id: string | null;
  slug: string;
  question: string;
  normalized_event: string;
  category: string;
  outcomes: Outcome[];
  headline_outcome_id: string;
  probability: number;
  confidence: string;
  reasoning: string;
  factors_up: { text: string; weight: number }[];
  factors_down: { text: string; weight: number }[];
  providers: { research: string; reasoning: string };
  is_dev_fallback: boolean;
  status: string;
  resolution_date: string | null;
  resolution_status: string;
  resolved_outcome_id: string | null;
  resolution_source: string | null;
  resolved_at: string | null;
  researched_at: string;
  created_at: string;
  evidence?: EvidenceRow[] | null;
}

interface EvidenceRow {
  id: string;
  prediction_id: string;
  title: string;
  url: string;
  source_name: string;
  published_at: string | null;
  summary: string;
  supports_outcome_id: string | null;
  strength: number;
  reliability: number;
  relevance: number;
  is_dev_fallback: boolean;
}

const SELECT_WITH_EVIDENCE = "*, evidence(*)";

export class SupabasePredictionStore implements PredictionStore {
  readonly name = "supabase";
  readonly isEphemeral = false;

  constructor(private readonly client: SupabaseClient) {}

  async save(forecast: Forecast): Promise<Forecast> {
    const { error } = await this.client.from("predictions").insert(toPredictionRow(forecast));
    if (error) throw new Error(`Could not save forecast: ${error.message}`);

    if (forecast.evidence.length > 0) {
      const { error: evidenceError } = await this.client
        .from("evidence")
        .insert(forecast.evidence.map((item) => toEvidenceRow(item, forecast.id)));
      // A forecast without its evidence rows is still worth keeping; surface the
      // failure in logs rather than throwing away a completed research run.
      if (evidenceError) console.error("Could not save evidence:", evidenceError.message);
    }

    return forecast;
  }

  async getById(id: string): Promise<Forecast | null> {
    const { data, error } = await this.client
      .from("predictions")
      .select(SELECT_WITH_EVIDENCE)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return fromRow(data as PredictionRow);
  }

  async listByUser(userId: string, limit = 50): Promise<Forecast[]> {
    const { data, error } = await this.client
      .from("predictions")
      .select(SELECT_WITH_EVIDENCE)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return (data as PredictionRow[]).map(fromRow);
  }

  async claim(id: string, userId: string): Promise<Forecast | null> {
    const { data, error } = await this.client
      .from("predictions")
      .update({ user_id: userId })
      .eq("id", id)
      .is("user_id", null)
      .select(SELECT_WITH_EVIDENCE)
      .maybeSingle();
    if (error) return null;
    // Already claimed by this user is a success, not a failure.
    return data ? fromRow(data as PredictionRow) : this.getById(id);
  }

  async resolve(id: string, resolution: ResolutionInput): Promise<Forecast | null> {
    const { data, error } = await this.client
      .from("predictions")
      .update({
        resolution_status: resolution.status,
        resolved_outcome_id: resolution.resolvedOutcomeId,
        resolution_source: resolution.resolutionSource,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(SELECT_WITH_EVIDENCE)
      .maybeSingle();
    if (error || !data) return null;
    return fromRow(data as PredictionRow);
  }
}

function toPredictionRow(forecast: Forecast) {
  return {
    id: forecast.id,
    user_id: forecast.userId,
    slug: forecast.slug,
    question: forecast.question,
    normalized_event: forecast.normalizedEvent,
    category: forecast.category,
    outcomes: forecast.outcomes,
    headline_outcome_id: forecast.headlineOutcomeId,
    probability: forecast.probability,
    confidence: forecast.confidence,
    reasoning: forecast.reasoning,
    factors_up: forecast.factorsUp,
    factors_down: forecast.factorsDown,
    providers: forecast.providers,
    is_dev_fallback: forecast.isDevFallback,
    status: "complete",
    resolution_date: forecast.resolutionDate,
    resolution_status: forecast.resolutionStatus,
    resolved_outcome_id: forecast.resolvedOutcomeId,
    resolution_source: forecast.resolutionSource,
    resolved_at: forecast.resolvedAt,
    researched_at: forecast.researchedAt,
    created_at: forecast.createdAt,
  };
}

function toEvidenceRow(item: EvidenceItem, predictionId: string) {
  return {
    id: item.id,
    prediction_id: predictionId,
    title: item.title,
    url: item.url,
    source_name: item.sourceName,
    published_at: item.publishedAt,
    summary: item.summary,
    supports_outcome_id: item.supportsOutcomeId,
    strength: item.strength,
    reliability: item.reliability,
    relevance: item.relevance,
    is_dev_fallback: item.isDevFallback,
  };
}

function fromRow(row: PredictionRow): Forecast {
  return {
    id: row.id,
    slug: row.slug,
    question: row.question,
    normalizedEvent: row.normalized_event,
    category: row.category as Category,
    outcomes: row.outcomes ?? [],
    headlineOutcomeId: row.headline_outcome_id,
    probability: Number(row.probability),
    confidence: row.confidence as Confidence,
    reasoning: row.reasoning,
    factorsUp: row.factors_up ?? [],
    factorsDown: row.factors_down ?? [],
    evidence: (row.evidence ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      sourceName: item.source_name,
      publishedAt: item.published_at,
      summary: item.summary,
      supportsOutcomeId: item.supports_outcome_id,
      strength: Number(item.strength),
      reliability: Number(item.reliability),
      relevance: Number(item.relevance),
      isDevFallback: item.is_dev_fallback,
    })),
    resolutionDate: row.resolution_date,
    resolutionStatus: row.resolution_status as ResolutionStatus,
    resolvedOutcomeId: row.resolved_outcome_id,
    resolutionSource: row.resolution_source,
    resolvedAt: row.resolved_at,
    researchedAt: row.researched_at,
    createdAt: row.created_at,
    userId: row.user_id,
    isDevFallback: row.is_dev_fallback,
    providers: row.providers ?? { research: "unknown", reasoning: "unknown" },
  };
}
