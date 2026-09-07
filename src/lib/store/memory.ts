import type { Forecast } from "@/lib/types";
import type { PredictionStore, ResolutionInput } from "./types";

/**
 * In-memory store used when Supabase isn't configured.
 *
 * Kept on `globalThis` so it survives Next's dev-server module reloads. It is
 * per-process and therefore useless behind more than one instance — that is
 * exactly why it is labelled ephemeral and surfaced in the UI.
 */
const globalForStore = globalThis as unknown as { __predictlyStore?: Map<string, Forecast> };
const forecasts = (globalForStore.__predictlyStore ??= new Map<string, Forecast>());

export class MemoryPredictionStore implements PredictionStore {
  readonly name = "memory";
  readonly isEphemeral = true;

  async save(forecast: Forecast): Promise<Forecast> {
    forecasts.set(forecast.id, forecast);
    return forecast;
  }

  async getById(id: string): Promise<Forecast | null> {
    return forecasts.get(id) ?? null;
  }

  async listByUser(userId: string, limit = 50): Promise<Forecast[]> {
    return [...forecasts.values()]
      .filter((f) => f.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async claim(id: string, userId: string): Promise<Forecast | null> {
    const existing = forecasts.get(id);
    if (!existing || (existing.userId && existing.userId !== userId)) return null;
    const claimed = { ...existing, userId };
    forecasts.set(id, claimed);
    return claimed;
  }

  async resolve(id: string, resolution: ResolutionInput): Promise<Forecast | null> {
    const existing = forecasts.get(id);
    if (!existing) return null;
    const resolved: Forecast = {
      ...existing,
      resolutionStatus: resolution.status,
      resolvedOutcomeId: resolution.resolvedOutcomeId,
      resolutionSource: resolution.resolutionSource,
      resolvedAt: new Date().toISOString(),
    };
    forecasts.set(id, resolved);
    return resolved;
  }
}
