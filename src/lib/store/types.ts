import type { Forecast, ResolutionStatus } from "@/lib/types";

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

  save(forecast: Forecast): Promise<Forecast>;
  getById(id: string): Promise<Forecast | null>;
  listByUser(userId: string, limit?: number): Promise<Forecast[]>;
  /** Attaches an anonymous forecast to a user account after they sign in. */
  claim(id: string, userId: string): Promise<Forecast | null>;
  resolve(id: string, resolution: ResolutionInput): Promise<Forecast | null>;
}
