import type { Category } from "@/lib/types";

/**
 * Seed set of open questions shown on the landing rails.
 *
 * This is a curated, static list — NOT live trending data. The UI labels it
 * "Worth predicting" for that reason. When a real trending pipeline exists it
 * should replace `getTrendingEvents()` and the label can change with it.
 *
 * Every entry must be a genuinely open question at the time of writing, and its
 * icon must actually correspond to the subject.
 */

/** Icon keys, resolved to real Lucide components in `TrendingRail`. */
export type TrendingIconKey =
  | "gamepad"
  | "trophy"
  | "bitcoin"
  | "smartphone"
  | "flag"
  | "landmark"
  | "award"
  | "rocket"
  | "percent"
  | "clapperboard"
  | "thermometer"
  | "chart"
  | "cpu"
  | "music"
  | "globe";

export interface TrendingEvent {
  id: string;
  question: string;
  category: Category;
  icon: TrendingIconKey;
}

const TRENDING_EVENTS: TrendingEvent[] = [
  { id: "gta-vi-delay", question: "Will GTA VI be delayed again?", category: "Gaming", icon: "gamepad" },
  { id: "ucl-winner", question: "Who will win the next Champions League?", category: "Sports", icon: "trophy" },
  { id: "btc-150k", question: "Will Bitcoin reach $150K before 2027?", category: "Crypto", icon: "bitcoin" },
  { id: "foldable-iphone", question: "Will Apple announce a foldable iPhone in 2027?", category: "Technology", icon: "smartphone" },
  { id: "next-f1-race", question: "Who will win the next F1 Grand Prix?", category: "Sports", icon: "flag" },
  { id: "france-president", question: "Who will be the next President of France?", category: "Politics", icon: "landmark" },
  { id: "ballon-dor", question: "Who will win the next Ballon d'Or?", category: "Sports", icon: "award" },
  { id: "starship-crewed", question: "Will Starship fly a crewed mission in 2027?", category: "Science", icon: "rocket" },
  { id: "fed-cut", question: "Will the Fed cut rates again before 2027?", category: "Finance", icon: "percent" },
  { id: "best-picture", question: "Which film wins Best Picture at the next Oscars?", category: "Entertainment", icon: "clapperboard" },
  { id: "temperature-record", question: "Will 2026 be the hottest year on record?", category: "Science", icon: "thermometer" },
  { id: "nvidia-most-valuable", question: "Will Nvidia end the year as the most valuable company?", category: "Business", icon: "chart" },
  { id: "next-frontier-model", question: "Will a new model top the reasoning benchmarks this quarter?", category: "Technology", icon: "cpu" },
  { id: "song-of-the-year", question: "Which track ends the year as the most streamed?", category: "Culture", icon: "music" },
  { id: "world-cup-host", question: "Will the next World Cup expand beyond 48 teams?", category: "Sports", icon: "globe" },
];

/**
 * Returns the seed list. Async and centralised on purpose: a real trending
 * pipeline can replace the body without touching any component.
 */
export function getTrendingEvents(): TrendingEvent[] {
  return TRENDING_EVENTS;
}

/** The two rails split the set so neither row repeats the other's questions. */
export function getTrendingRails(): [TrendingEvent[], TrendingEvent[]] {
  const events = getTrendingEvents();
  const midpoint = Math.ceil(events.length / 2);
  return [events.slice(0, midpoint), events.slice(midpoint)];
}

export function findTrendingEvent(id: string): TrendingEvent | undefined {
  return TRENDING_EVENTS.find((event) => event.id === id);
}
