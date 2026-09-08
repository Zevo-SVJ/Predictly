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
  | "shield";

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
  category: Category;
  icon: TrendingIconKey;
  /** Where this entry came from. `curated` is the hand-written seed set. */
  source: "curated" | "live";
  /** When this became topical. */
  publishedAt: string;
  /** After this, the question is no longer current and is dropped. */
  expiresAt: string;
  /** Higher sorts first. */
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
