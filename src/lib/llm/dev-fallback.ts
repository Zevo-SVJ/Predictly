import { CATEGORIES, type Category } from "@/lib/types";
import type { ReasoningProvider, ReasoningRequest } from "./types";

/**
 * Development fallback used when `ANTHROPIC_API_KEY` is absent.
 *
 * It runs deterministic heuristics instead of a language model so the pipeline
 * is exercisable end-to-end without credentials. Forecasts produced this way
 * are flagged `isDevFallback` and the UI says so plainly — they are not
 * research and are not calibrated.
 */
export class DevFallbackReasoningProvider implements ReasoningProvider {
  readonly name = "dev-fallback";
  readonly isDevFallback = true;

  async run<T>({ task, input }: ReasoningRequest<T>): Promise<T> {
    switch (task) {
      case "understand":
        return understand(input as UnderstandInput) as T;
      case "evaluate":
        return evaluate(input as EvaluateInput) as T;
      case "narrate":
        return narrate(input as NarrateInput) as T;
    }
  }
}

interface UnderstandInput {
  question: string;
  today: string;
}
interface EvaluateInput {
  outcomes: { id: string; label: string }[];
  sources: { index: number; title: string; snippet: string }[];
}
interface NarrateInput {
  normalizedEvent: string;
  headlineLabel: string;
  probability: number;
  evidence: { summary: string; supportsOutcomeId: string | null }[];
  headlineOutcomeId: string;
}

/** Keyword table used only by the fallback to pick a plausible category. */
const CATEGORY_HINTS: [Category, RegExp][] = [
  ["Sports", /\b(win|champions? league|world cup|f1|formula 1|nba|nfl|ballon d'?or|match|season|cup)\b/i],
  ["Politics", /\b(election|president|prime minister|parliament|senate|vote|referendum|governor)\b/i],
  ["Crypto", /\b(bitcoin|btc|ethereum|eth|solana|crypto|token|altcoin)\b/i],
  ["Finance", /\b(stock|s&p|nasdaq|rate cut|inflation|recession|ipo|earnings)\b/i],
  ["Gaming", /\b(gta|game|console|nintendo|playstation|xbox|steam|studio|dlc)\b/i],
  ["Technology", /\b(apple|iphone|ai|model|chip|launch|release|android|openai|nvidia)\b/i],
  ["Entertainment", /\b(film|movie|oscar|album|series|season|netflix|box office|grammy)\b/i],
  ["Business", /\b(acquisition|merger|ceo|layoffs|revenue|company|startup)\b/i],
  ["Science", /\b(mission|launch|nasa|spacex|vaccine|study|climate|fusion)\b/i],
  ["Culture", /\b(word of the year|trend|viral|meme|festival)\b/i],
];

function understand({ question, today }: UnderstandInput) {
  const category =
    CATEGORY_HINTS.find(([, pattern]) => pattern.test(question))?.[0] ??
    ("Other" satisfies Category);

  const isBinary = /^(will|is|does|can|did|should|would)\b/i.test(question.trim());
  const outcomes = isBinary
    ? [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ]
    : [
        { id: "leading-candidate", label: "The current front-runner" },
        { id: "another-outcome", label: "Someone or something else" },
      ];

  const horizon = new Date(today);
  horizon.setUTCFullYear(horizon.getUTCFullYear() + 1);

  return {
    normalizedEvent: `${question.trim().replace(/\?+$/, "")}, resolved by public reporting.`,
    category: CATEGORIES.includes(category) ? category : "Other",
    quality: question.trim().length < 8 ? "malformed" : "clear",
    qualityNote:
      "Interpreted by the local development heuristic. No language model was consulted.",
    outcomes,
    priors: outcomes.map((outcome, index) => ({
      outcomeId: outcome.id,
      prior: index === 0 ? 0.55 : 0.45,
    })),
    priorRationale:
      "Development fallback prior: near-even, with a slight lean to the affirmative outcome. Not derived from any reference class.",
    resolutionDate: horizon.toISOString().slice(0, 10),
    searchQueries: [question.trim()],
  };
}

/** Scores fixtures by their angle so the aggregation step sees a real spread. */
function evaluate({ outcomes, sources }: EvaluateInput) {
  const affirmative = outcomes[0]?.id ?? "yes";
  const negative = outcomes[1]?.id ?? outcomes[0]?.id ?? "no";

  return {
    assessments: sources.map((source) => {
      const text = `${source.title} ${source.snippet}`.toLowerCase();
      const opposing = /other way|internal pressure|against|contradict|dispute/.test(text);
      const weak = /low-signal|speculation|unattributed|rumour|rumor/.test(text);
      const official = /official|statement|confirmed|announced/.test(text);

      return {
        sourceIndex: source.index,
        summary: source.snippet.slice(0, 300),
        supportsOutcomeId: weak ? null : opposing ? negative : affirmative,
        strength: weak ? 0.15 : official ? 0.7 : 0.45,
        reliability: weak ? 0.2 : official ? 0.85 : 0.55,
        relevance: 0.7,
      };
    }),
  };
}

function narrate({ normalizedEvent, headlineLabel, probability, evidence, headlineOutcomeId }: NarrateInput) {
  const supporting = evidence.filter((e) => e.supportsOutcomeId === headlineOutcomeId);
  const opposing = evidence.filter(
    (e) => e.supportsOutcomeId && e.supportsOutcomeId !== headlineOutcomeId,
  );
  const percent = Math.round(probability * 100);

  return {
    reasoning:
      `This forecast was produced by Predictly's local development fallback, not by research. ` +
      `It estimates roughly ${percent}% for "${headlineLabel}" on the question of ${normalizedEvent} ` +
      `by aggregating ${evidence.length} synthetic fixtures. Treat the number as a plumbing check, not a forecast.`,
    factorsUp: (supporting.length ? supporting : evidence).slice(0, 3).map((item, index) => ({
      text: item.summary.slice(0, 150),
      weight: 0.7 - index * 0.15,
    })),
    factorsDown: (opposing.length ? opposing : evidence.slice(-2)).slice(0, 3).map((item, index) => ({
      text: item.summary.slice(0, 150),
      weight: 0.6 - index * 0.15,
    })),
  };
}
