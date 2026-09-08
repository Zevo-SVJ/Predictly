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

/**
 * Both rails carry the full set, in different orders.
 *
 * Splitting the set in half would halve each rail's unique content, and with
 * wide pills the seamless-loop duplicate then becomes visible inside a single
 * desktop viewport. Giving each rail everything — one in priority order, the
 * other rotated and reversed — keeps the two rows visibly different while
 * pushing the repeat off-screen.
 */
export function getTrendingRails(now?: Date): [TrendingEvent[], TrendingEvent[]] {
  const events = getTrendingEvents(now);
  if (events.length === 0) return [[], []];

  const offset = Math.floor(events.length / 2);
  const rotated = [...events.slice(offset), ...events.slice(0, offset)].reverse();
  return [events, rotated];
}
