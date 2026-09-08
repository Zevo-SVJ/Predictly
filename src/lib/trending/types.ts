import type { Category } from "@/lib/types";

/** Icon keys, resolved to real Lucide components in the rail component. */
export type TrendingIconKey =
  | "trophy"
  | "smartphone"
  | "football"
  | "racing"
  | "tennis"
  | "bitcoin"
  | "sparkles"
  | "shield"
  | "chart";

/**
 * One question worth asking right now.
 *
 * `publishedAt` / `expiresAt` exist so a live provider can reason about
 * freshness, and so the curated seed set decays on its own rather than
 * silently going stale: an event past its `expiresAt` is filtered out.
 */
export interface TrendingEvent {
  id: string;
  /** The exact question loaded into the prediction input when clicked. */
  question: string;
  /** Compact label for the rail pill. */
  shortTitle: string;
  /** Editorial topic label, e.g. "BALLON D'OR". Shown in the ticker. */
  topic: string;
  category: Category;
  icon: TrendingIconKey;
  /** When the event itself is expected to resolve, if known. */
  eventDate: string | null;
  /** Where this entry came from. `curated` is the hand-written seed set. */
  source: "curated" | "live";
  /** Attribution for a live provider. Never set for curated entries. */
  sourceUrl?: string;
  /** When this became topical. */
  publishedAt: string;
  /** After this, the question is no longer current and is dropped. */
  expiresAt: string;
  /**
   * Editorial ordering weight for the curated set. A live provider may replace
   * this with a real trend score; it is never presented to users as a measured
   * value, because for curated entries it is only a hand-set priority.
   */
  priority: number;
}

/**
 * Swappable source of trending questions.
 *
 * The curated implementation is the only one today. A live implementation
 * (news API, search-trends feed, or the most-asked questions in our own
 * database) can replace it without touching a single component.
 */
export interface TrendingEventsProvider {
  readonly name: string;
  /** True when entries reflect live signal rather than a curated list. */
  readonly isLive: boolean;
  getEvents(now?: Date): TrendingEvent[];
}

/**
 * Shape a future live provider would implement — news APIs, sports fixtures,
 * market data or the most-asked questions in our own database. Kept here so the
 * seam is explicit: nothing above this layer knows where questions come from.
 */
export type TrendingProviderKind = "curated" | "news" | "fixtures" | "internal";
