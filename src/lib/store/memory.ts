import type { ForecastResult } from "@/lib/types";
import type { PredictionStore, ResolutionInput } from "./types";

/**
 * In-memory store used when Supabase isn't configured.
 *
 * Kept on `globalThis` so it survives Next's dev-server module reloads. It is
 * per-process and therefore useless behind more than one instance — that is
 * exactly why it is labelled ephemeral and surfaced in the UI.
 */
const globalForStore = globalThis as unknown as { __predictlyStore?: Map<string, ForecastResult> };
const forecasts = (globalForStore.__predictlyStore ??= new Map<string, ForecastResult>());

export class MemoryPredictionStore implements PredictionStore {
  readonly name = "memory";
  readonly isEphemeral = true;

  async save(forecast: ForecastResult): Promise<ForecastResult> {
    forecasts.set(forecast.id, forecast);
    return forecast;
  }

  async getById(id: string): Promise<ForecastResult | null> {
    return forecasts.get(id) ?? null;
  }

  async listByUser(userId: string, limit = 50): Promise<ForecastResult[]> {
    return [...forecasts.values()]
      .filter((f) => f.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async findLatestBySlugs(slugs: string[]): Promise<Map<string, ForecastResult>> {
    const wanted = new Set(slugs);
    const latest = new Map<string, ForecastResult>();

    for (const forecast of [...forecasts.values()].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    )) {
      // Ascending order means the last write for a slug wins.
      if (wanted.has(forecast.slug)) latest.set(forecast.slug, forecast);
    }
    return latest;
  }

  async claim(id: string, userId: string): Promise<ForecastResult | null> {
    const existing = forecasts.get(id);
    if (!existing || (existing.userId && existing.userId !== userId)) return null;
    const claimed = { ...existing, userId };
    forecasts.set(id, claimed);
    return claimed;
  }

  async resolve(id: string, resolution: ResolutionInput): Promise<ForecastResult | null> {
    const existing = forecasts.get(id);
    if (!existing) return null;
    const resolved: ForecastResult = {
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
