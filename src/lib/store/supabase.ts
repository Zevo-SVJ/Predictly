import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Category,
  Confidence,
  EvidenceItem,
  ForecastResult,
  ForecastStatus,
  Outcome,
  ResolutionStatus,
  Stance,
} from "@/lib/types";
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
  outcome: string;
  probability: number;
  confidence: string;
  reasoning: string;
  factors_for: { text: string; weight: number }[];
  factors_against: { text: string; weight: number }[];
  providers: { research: string; reasoning: string };
  status: string;
  event_date: string | null;
  resolution_status: string;
  resolved_outcome: string | null;
  resolution_source: string | null;
  resolution_date: string | null;
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
  stance: string;
  strength: number;
  reliability: number;
  relevance: number;
}

const SELECT_WITH_EVIDENCE = "*, evidence(*)";

export class SupabasePredictionStore implements PredictionStore {
  readonly name = "supabase";
  readonly isEphemeral = false;

  constructor(private readonly client: SupabaseClient) {}

  async save(forecast: ForecastResult): Promise<ForecastResult> {
    const { error } = await this.client.from("predictions").insert(toPredictionRow(forecast));
    if (error) throw new Error(`Could not save forecast: ${error.message}`);

    if (forecast.evidence.length > 0) {
      const { error: evidenceError } = await this.client
        .from("evidence")
        .insert(forecast.evidence.map((item) => toEvidenceRow(item, forecast.id)));
      // A forecast without its evidence rows is still worth keeping; log rather
      // than discard a completed research run.
      if (evidenceError) console.error("Could not save evidence:", evidenceError.message);
    }

    return forecast;
  }

  async getById(id: string): Promise<ForecastResult | null> {
    const { data, error } = await this.client
      .from("predictions")
      .select(SELECT_WITH_EVIDENCE)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return fromRow(data as PredictionRow);
  }

  async listByUser(userId: string, limit = 50): Promise<ForecastResult[]> {
    const { data, error } = await this.client
      .from("predictions")
      .select(SELECT_WITH_EVIDENCE)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return (data as PredictionRow[]).map(fromRow);
  }

  async findLatestBySlugs(slugs: string[]): Promise<Map<string, ForecastResult>> {
    const latest = new Map<string, ForecastResult>();
    if (slugs.length === 0) return latest;

    // Evidence is not selected here: the feed only needs headline numbers, and
    // pulling every source for ten rows would be wasteful.
    const { data, error } = await this.client
      .from("predictions")
      .select("*")
      .in("slug", slugs)
      .eq("status", "complete")
      .order("created_at", { ascending: false })
      .limit(slugs.length * 4);
    if (error || !data) return latest;

    for (const row of data as PredictionRow[]) {
      // Descending order means the first row seen for a slug is the newest.
      if (!latest.has(row.slug)) latest.set(row.slug, fromRow(row));
    }
    return latest;
  }

  async claim(id: string, userId: string): Promise<ForecastResult | null> {
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

  async resolve(id: string, resolution: ResolutionInput): Promise<ForecastResult | null> {
    const { data, error } = await this.client
      .from("predictions")
      .update({
        resolution_status: resolution.status,
        resolved_outcome: resolution.resolvedOutcomeId,
        resolution_source: resolution.resolutionSource,
        resolution_date: new Date().toISOString(),
      })
      .eq("id", id)
      .select(SELECT_WITH_EVIDENCE)
      .maybeSingle();
    if (error || !data) return null;
    return fromRow(data as PredictionRow);
  }
}

function toPredictionRow(forecast: ForecastResult) {
  return {
    id: forecast.id,
    user_id: forecast.userId,
    slug: forecast.slug,
    question: forecast.question,
    normalized_event: forecast.normalizedEvent,
    category: forecast.category,
    outcomes: forecast.outcomes,
    headline_outcome_id: forecast.headlineOutcomeId,
    outcome: forecast.outcome,
    probability: forecast.probability,
    confidence: forecast.confidence,
    reasoning: forecast.reasoning,
    factors_for: forecast.factorsFor,
    factors_against: forecast.factorsAgainst,
    providers: forecast.providers,
    status: forecast.status,
    event_date: forecast.eventDate,
    resolution_status: forecast.resolutionStatus,
    resolved_outcome: forecast.resolvedOutcomeId,
    resolution_source: forecast.resolutionSource,
    resolution_date: forecast.resolvedAt,
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
    stance: item.stance,
    strength: item.strength,
    reliability: item.reliability,
    relevance: item.relevance,
  };
}

function fromRow(row: PredictionRow): ForecastResult {
  return {
    id: row.id,
    slug: row.slug,
    question: row.question,
    normalizedEvent: row.normalized_event,
    category: row.category as Category,
    outcomes: row.outcomes ?? [],
    headlineOutcomeId: row.headline_outcome_id,
    outcome: row.outcome,
    probability: Number(row.probability),
    confidence: row.confidence as Confidence,
    reasoning: row.reasoning,
    factorsFor: row.factors_for ?? [],
    factorsAgainst: row.factors_against ?? [],
    evidence: (row.evidence ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      sourceName: item.source_name,
      publishedAt: item.published_at,
      summary: item.summary,
      supportsOutcomeId: item.supports_outcome_id,
      stance: item.stance as Stance,
      strength: Number(item.strength),
      reliability: Number(item.reliability),
      relevance: Number(item.relevance),
    })),
    eventDate: row.event_date,
    status: row.status as ForecastStatus,
    resolutionStatus: row.resolution_status as ResolutionStatus,
    resolvedOutcomeId: row.resolved_outcome,
    resolutionSource: row.resolution_source,
    resolvedAt: row.resolution_date,
    researchedAt: row.researched_at,
    createdAt: row.created_at,
    userId: row.user_id,
    providers: row.providers ?? { research: "unknown", reasoning: "unknown" },
  };
}
