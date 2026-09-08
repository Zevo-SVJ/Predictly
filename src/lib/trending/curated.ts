import type { TrendingEvent, TrendingEventsProvider } from "./types";

/**
 * Hand-curated seed set of genuinely open questions, current as of 8 Sep 2026.
 *
 * This is NOT live trend data and the UI never claims it is. Each entry carries
 * an `expiresAt` so it drops out once the question stops being open, rather
 * than lingering as a stale claim. `priority` is an editorial ordering weight,
 * never shown to users as a measured trend score.
 *
 * Every question here must be objectively resolvable and genuinely undecided.
 */
const SEED: TrendingEvent[] = [
  {
    id: "ballon-dor-2026",
    question: "Who will win the 2026 Ballon d'Or?",
    shortTitle: "Who wins the 2026 Ballon d'Or?",
    topic: "Ballon d'Or",
    category: "Sports",
    icon: "trophy",
    eventDate: "2026-10-26",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-12-31",
    priority: 100,
  },
  {
    id: "apple-foldable-iphone",
    question: "Will Apple unveil its first foldable iPhone at its September 2026 event?",
    shortTitle: "Foldable iPhone at the September event?",
    topic: "Apple",
    category: "Technology",
    icon: "smartphone",
    eventDate: "2026-09-09",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-09-30",
    priority: 99,
  },
  {
    id: "us-open-2026",
    question: "Who will win the 2026 US Open men's singles title?",
    shortTitle: "Who wins the 2026 US Open?",
    topic: "US Open",
    category: "Sports",
    icon: "tennis",
    eventDate: "2026-09-13",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-09-20",
    priority: 97,
  },
  {
    id: "f1-title-2026",
    question: "Who will win the 2026 Formula 1 World Drivers' Championship?",
    shortTitle: "Who wins the 2026 F1 title?",
    topic: "Formula 1",
    category: "Sports",
    icon: "racing",
    eventDate: "2026-12-06",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-12-31",
    priority: 95,
  },
  {
    id: "bitcoin-100k",
    question: "Will Bitcoin reach $100,000 before the end of 2026?",
    shortTitle: "Bitcoin to $100K before 2027?",
    topic: "Bitcoin",
    category: "Crypto",
    icon: "bitcoin",
    eventDate: "2026-12-31",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-12-31",
    priority: 93,
  },
  {
    id: "ucl-2026-27",
    question: "Who will win the 2026-27 UEFA Champions League?",
    shortTitle: "Who wins the Champions League?",
    topic: "Champions League",
    category: "Sports",
    icon: "football",
    eventDate: "2027-06-05",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2027-06-30",
    priority: 91,
  },
  {
    id: "siri-overhaul",
    question: "Will Apple ship its rebuilt Siri to the public before the end of 2026?",
    shortTitle: "Does the rebuilt Siri ship in 2026?",
    topic: "Siri",
    category: "Technology",
    icon: "sparkles",
    eventDate: "2026-12-31",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-12-31",
    priority: 89,
  },
  {
    id: "ai-agents-search",
    question: "Will AI assistants account for more than 10% of web search referrals by the end of 2027?",
    shortTitle: "AI assistants past 10% of search referrals?",
    topic: "AI",
    category: "Technology",
    icon: "sparkles",
    eventDate: "2027-12-31",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2027-12-31",
    priority: 87,
  },
  {
    id: "arsenal-ucl",
    question: "Will Arsenal win the 2026-27 UEFA Champions League?",
    shortTitle: "Arsenal to win the Champions League?",
    topic: "Arsenal",
    category: "Sports",
    icon: "shield",
    eventDate: "2027-06-05",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2027-06-30",
    priority: 85,
  },
  {
    id: "fed-september-cut",
    question: "Will the US Federal Reserve cut interest rates at its September 2026 meeting?",
    shortTitle: "Fed cut at the September meeting?",
    topic: "Markets",
    category: "Finance",
    icon: "chart",
    eventDate: "2026-09-16",
    source: "curated",
    publishedAt: "2026-09-08",
    expiresAt: "2026-09-30",
    priority: 83,
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
