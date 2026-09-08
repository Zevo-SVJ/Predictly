import { CuratedTrendingProvider } from "./curated";
import type { TrendingEvent, TrendingEventsProvider } from "./types";

export * from "./types";

const provider: TrendingEventsProvider = new CuratedTrendingProvider();

export function getTrendingProvider(): TrendingEventsProvider {
  return provider;
}

export function getTrendingEvents(now?: Date): TrendingEvent[] {
  return provider.getEvents(now);
}
