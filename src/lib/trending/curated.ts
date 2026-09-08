import type { TrendingEvent, TrendingEventsProvider } from "./types";

/**
 * Hand-curated seed set of genuinely open questions, current as of 8 Sep 2026.
 *
 * This is NOT live trend data, and the UI never claims it is — it is labelled
 * "Trending predictions", not "Live trending". Each entry carries an
 * `expiresAt` so it disappears once the question stops being open rather than
 * lingering as a stale claim.
 *
 * Every question here must be genuinely undecided at the time of writing.
 */
const SEED: TrendingEvent[] = [
  {
    id: "ballon-dor-2026",
    question: "Who will win the 2026 Ballon d'Or?",
    shortTitle: "Who wins the 2026 Ballon d'Or?",
    category: "Sports",
    icon: "trophy",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-12-31",
    priority: 100,
  },
  {
    id: "apple-foldable-iphone",
    question: "Will Apple unveil its first foldable iPhone at its September 2026 event?",
    shortTitle: "Foldable iPhone tomorrow?",
    category: "Technology",
    icon: "smartphone",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-09-30",
    priority: 98,
  },
  {
    id: "us-open-2026",
    question: "Who will win the 2026 US Open men's singles title?",
    shortTitle: "Who wins the 2026 US Open?",
    category: "Sports",
    icon: "tennis",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-09-20",
    priority: 96,
  },
  {
    id: "f1-title-2026",
    question: "Who will win the 2026 Formula 1 World Championship?",
    shortTitle: "Who wins the 2026 F1 title?",
    category: "Sports",
    icon: "racing",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-12-31",
    priority: 94,
  },
  {
    id: "ucl-2026-27",
    question: "Who will win the 2026-27 UEFA Champions League?",
    shortTitle: "Who wins the Champions League?",
    category: "Sports",
    icon: "football",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2027-06-30",
    priority: 92,
  },
  {
    id: "bitcoin-100k",
    question: "Will Bitcoin reach $100,000 before the end of 2026?",
    shortTitle: "Bitcoin to $100K before 2027?",
    category: "Crypto",
    icon: "bitcoin",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-12-31",
    priority: 90,
  },
  {
    id: "siri-overhaul",
    question: "Will Apple ship its rebuilt Siri to the public before the end of 2026?",
    shortTitle: "Does the new Siri ship in 2026?",
    category: "Technology",
    icon: "sparkles",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-12-31",
    priority: 88,
  },
  {
    id: "arsenal-ucl",
    question: "Will Arsenal win the 2026-27 UEFA Champions League?",
    shortTitle: "Arsenal to win the Champions League?",
    category: "Sports",
    icon: "shield",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2027-06-30",
    priority: 86,
  },
];

export class CuratedTrendingProvider implements TrendingEventsProvider {
  readonly name = "curated";
  readonly isLive = false;

  getEvents(now = new Date()): TrendingEvent[] {
    return SEED.filter((event) => new Date(event.expiresAt) >= now).sort(
      (a, b) => b.priority - a.priority,
    );
  }
}
