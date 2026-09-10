import { calculateProbability } from "@/lib/forecast/probability";
import type { Category, Confidence, EvidenceItem, Outcome, Stance } from "@/lib/types";

/**
 * Demo content for the landing page.
 *
 * Everything exported here is illustrative. It is confined to this module so
 * there is never any doubt in a component about whether it is holding real
 * research or an example, and every surface that renders it is required to
 * show the "Example forecast" stamp.
 *
 * Three rules keep it honest, and they are the reason this file looks the way
 * it does rather than being a hand-written block of impressive numbers.
 *
 *   1. No probability below is written down. Each one comes out of
 *      `calculateProbability` — the same function the live pipeline uses — fed
 *      by the weights in this file. The arithmetic on screen is real.
 *   2. No source is quoted, headlined, dated or linked. `beat` describes what
 *      an outlet actually covers, which is a true statement about the outlet;
 *      it is never a claim about what that outlet published on this question.
 *      Inventing a citation is the one thing a research product cannot do.
 *   3. Nothing here claims anything about Predictly — no accuracy, no volume,
 *      no adoption.
 *
 * `DEMO_NOW` is frozen so recency weighting, and therefore every number, is
 * identical on the server and in the browser. A `new Date()` here would put a
 * hydration mismatch on the most prominent figure on the page.
 */
const DEMO_NOW = new Date("2026-09-10T00:00:00.000Z");

/** Keys resolved to real SVG marks by `SourceLogo`. */
export type BrandKey =
  | "apple"
  | "f1"
  | "mclaren"
  | "redbull"
  | "guardian"
  | "nyt"
  | "cnn"
  | "arstechnica"
  | "techcrunch"
  | "dazn";

export interface DemoSource {
  id: string;
  name: string;
  brand: BrandKey;
  /** What kind of source this is, in Predictly's own vocabulary. */
  kind: "Primary source" | "Newspaper of record" | "Trade press" | "Broadcast" | "Governing body";
  /** A true description of what the outlet covers. Never a claim about this question. */
  beat: string;
  stance: Stance;
  /** Product scores, 0–1, shown as the engine would show them. */
  relevance: number;
  reliability: number;
}

export interface DemoOutcome {
  id: string;
  label: string;
  /** Optional supporting mark, e.g. the constructor a driver races for. */
  brand?: BrandKey;
  /** Secondary line under the label, e.g. the team name. */
  detail?: string;
}

export interface DemoForecast {
  id: string;
  question: string;
  category: Category;
  /** Short, factual horizon taken from the question itself. */
  horizon: string;
  outcomes: Outcome[];
  outcomeMeta: DemoOutcome[];
  headlineOutcomeId: string;
  probability: number;
  confidence: Confidence;
  sources: DemoSource[];
}

/**
 * Turns a demo's sources into the evidence shape the probability engine reads,
 * so the demo and the live pipeline compute their numbers the same way.
 *
 * `strength` is carried on the source as its stance weight; publication dates
 * are staggered close to `DEMO_NOW` because a demo showing stale evidence would
 * misrepresent how the recency term behaves.
 */
function toEvidence(
  sources: DemoSource[],
  supports: Record<string, string | null>,
  strengths: Record<string, number>,
): EvidenceItem[] {
  return sources.map((source, index) => ({
    id: source.id,
    title: source.name,
    url: "",
    sourceName: source.name,
    publishedAt: new Date(DEMO_NOW.getTime() - (index + 2) * 86_400_000).toISOString().slice(0, 10),
    summary: source.beat,
    supportsOutcomeId: supports[source.id] ?? null,
    stance: source.stance,
    strength: strengths[source.id] ?? 0.5,
    reliability: source.reliability,
    relevance: source.relevance,
  }));
}

function build(
  input: Omit<DemoForecast, "outcomes" | "probability" | "confidence" | "headlineOutcomeId"> & {
    priors: { outcomeId: string; prior: number }[];
    supports: Record<string, string | null>;
    strengths: Record<string, number>;
  },
): DemoForecast {
  const scored = calculateProbability(
    input.outcomeMeta.map((o) => ({ id: o.id, label: o.label })),
    input.priors,
    toEvidence(input.sources, input.supports, input.strengths),
    DEMO_NOW,
  );

  return {
    id: input.id,
    question: input.question,
    category: input.category,
    horizon: input.horizon,
    outcomeMeta: input.outcomeMeta,
    sources: input.sources,
    outcomes: scored.outcomes,
    headlineOutcomeId: scored.headlineOutcomeId,
    probability: scored.probability,
    confidence: scored.confidence,
  };
}

/* ------------------------------------------------------------------ F1 ---
 * The hero preview. Four outcomes rather than two, because a multi-way race is
 * what makes a probability distribution legible at a glance, and motorsport is
 * one of the few domains where every entity involved has a real, licensed mark.
 */
export const DEMO_RACE: DemoForecast = build({
  id: "demo-race",
  question: "Who will win the next F1 race?",
  category: "Sports",
  horizon: "Next race weekend",
  outcomeMeta: [
    { id: "norris", label: "Lando Norris", brand: "mclaren", detail: "McLaren" },
    { id: "piastri", label: "Oscar Piastri", brand: "mclaren", detail: "McLaren" },
    { id: "verstappen", label: "Max Verstappen", brand: "redbull", detail: "Red Bull" },
    { id: "field", label: "Any other driver", detail: "Rest of the grid" },
  ],
  priors: [
    { outcomeId: "norris", prior: 0.26 },
    { outcomeId: "piastri", prior: 0.24 },
    { outcomeId: "verstappen", prior: 0.22 },
    // The rest of the grid is one outcome but twenty cars, so its structural
    // base rate is the largest of the four before any evidence is read.
    { outcomeId: "field", prior: 0.28 },
  ],
  sources: [
    {
      id: "f1",
      name: "Formula 1",
      brand: "f1",
      kind: "Governing body",
      beat: "Official timing, session results and the race calendar.",
      stance: "supports",
      relevance: 0.96,
      reliability: 0.95,
    },
    {
      id: "mclaren",
      name: "McLaren",
      brand: "mclaren",
      kind: "Primary source",
      beat: "Team communications on car upgrades and driver availability.",
      stance: "supports",
      relevance: 0.88,
      reliability: 0.78,
    },
    {
      id: "dazn",
      name: "DAZN",
      brand: "dazn",
      kind: "Broadcast",
      beat: "Race coverage, practice analysis and paddock interviews.",
      stance: "opposes",
      relevance: 0.82,
      reliability: 0.74,
    },
    {
      id: "guardian",
      name: "The Guardian",
      brand: "guardian",
      kind: "Newspaper of record",
      beat: "Independent motorsport reporting and championship analysis.",
      stance: "opposes",
      relevance: 0.79,
      reliability: 0.86,
    },
    {
      id: "redbull",
      name: "Red Bull",
      brand: "redbull",
      kind: "Primary source",
      beat: "Team communications on setup direction and reliability work.",
      stance: "opposes",
      relevance: 0.84,
      reliability: 0.76,
    },
  ],
  supports: {
    f1: "norris",
    mclaren: "norris",
    dazn: "piastri",
    guardian: "piastri",
    redbull: "verstappen",
  },
  strengths: { f1: 0.62, mclaren: 0.68, dazn: 0.66, guardian: 0.38, redbull: 0.7 },
});

/* --------------------------------------------------------------- Apple ---
 * The single forecast result section. Binary, so the page shows both shapes a
 * forecast can take: a distribution across a field, and one number with its
 * complement.
 */
export const DEMO_APPLE: DemoForecast = build({
  id: "demo-apple",
  question: "Will Apple release a foldable iPhone in 2027?",
  category: "Technology",
  horizon: "Resolves 31 December 2027",
  outcomeMeta: [
    { id: "yes", label: "Yes", detail: "Ships to customers within the year" },
    { id: "no", label: "No", detail: "Announced later, or not at all" },
  ],
  priors: [
    { outcomeId: "yes", prior: 0.52 },
    { outcomeId: "no", prior: 0.48 },
  ],
  sources: [
    {
      id: "apple",
      name: "Apple",
      brand: "apple",
      kind: "Primary source",
      beat: "Product announcements, filings and event scheduling.",
      stance: "supports",
      relevance: 0.94,
      reliability: 0.93,
    },
    {
      id: "arstechnica",
      name: "Ars Technica",
      brand: "arstechnica",
      kind: "Trade press",
      beat: "Hardware teardowns and display-technology analysis.",
      stance: "supports",
      relevance: 0.89,
      reliability: 0.85,
    },
    {
      id: "techcrunch",
      name: "TechCrunch",
      brand: "techcrunch",
      kind: "Trade press",
      beat: "Consumer-hardware launches and component supply reporting.",
      stance: "supports",
      relevance: 0.83,
      reliability: 0.74,
    },
    {
      id: "nyt",
      name: "The New York Times",
      brand: "nyt",
      kind: "Newspaper of record",
      beat: "Technology-industry reporting and manufacturing coverage.",
      stance: "opposes",
      relevance: 0.76,
      reliability: 0.9,
    },
    {
      id: "cnn",
      name: "CNN",
      brand: "cnn",
      kind: "Broadcast",
      beat: "Business and consumer-technology coverage.",
      stance: "neutral",
      relevance: 0.61,
      reliability: 0.72,
    },
  ],
  supports: {
    apple: "yes",
    arstechnica: "yes",
    techcrunch: "yes",
    nyt: "no",
    cnn: null,
  },
  strengths: { apple: 0.68, arstechnica: 0.62, techcrunch: 0.52, nyt: 0.66, cnn: 0.3 },
});

/** The three suggestion chips in the hero and the final call to action. */
export const DEMO_SUGGESTIONS = [
  "Who will win the next Champions League?",
  "Will Apple release a foldable iPhone in 2027?",
  "Who will win the next F1 race?",
];
