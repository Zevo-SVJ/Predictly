import type { ForecastResult, ResolutionStatus } from "@/lib/types";

export interface ResolutionInput {
  status: Exclude<ResolutionStatus, "unresolved">;
  resolvedOutcomeId: string | null;
  resolutionSource: string | null;
}

/**
 * Persistence contract for forecasts.
 *
 * Backed by Postgres via Supabase in any real deployment, and by an in-process
 * map when Supabase isn't configured so the whole flow — including public share
 * URLs — works locally.
 */
export interface PredictionStore {
  readonly name: string;
  readonly isEphemeral: boolean;

  save(forecast: ForecastResult): Promise<ForecastResult>;
  getById(id: string): Promise<ForecastResult | null>;
  listByUser(userId: string, limit?: number): Promise<ForecastResult[]>;
  /**
   * Most recent completed forecast for each of the given slugs.
   *
   * Powers the discovery feed, which shows a real probability when one exists
   * and says so plainly when it doesn't — it never invents a number.
   */
  findLatestBySlugs(slugs: string[]): Promise<Map<string, ForecastResult>>;
  /** Attaches an anonymous forecast to a user account after they sign in. */
  claim(id: string, userId: string): Promise<ForecastResult | null>;
  resolve(id: string, resolution: ResolutionInput): Promise<ForecastResult | null>;
}
