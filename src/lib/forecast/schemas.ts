import { z } from "zod";
import { CATEGORIES } from "@/lib/types";

const slug = z
  .string()
  .min(1)
  .max(48)
  .describe("Lowercase kebab-case identifier, e.g. 'yes' or 'real-madrid'");

/** Step 1 — turn a free-text question into a well-posed forecasting problem. */
export const EventUnderstandingSchema = z.object({
  normalizedEvent: z
    .string()
    .describe(
      "The question restated so two careful people would agree on how it resolves. Must state what counts as the event happening and by when.",
    ),
  category: z.enum(CATEGORIES),
  quality: z
    .enum(["clear", "ambiguous", "not_future", "malformed"])
    .describe(
      "'clear' when the event is a well-defined future occurrence; 'ambiguous' when resolution criteria cannot be pinned down; 'not_future' when it already resolved or is not about the future; 'malformed' when it is not a question about an event at all.",
    ),
  qualityNote: z
    .string()
    .describe("One sentence explaining the quality judgement, addressed to the user."),
  outcomes: z
    .array(z.object({ id: slug, label: z.string().min(1).max(80) }))
    .min(2)
    .max(6)
    .describe(
      "Mutually exclusive, collectively exhaustive outcomes. Use exactly ['yes','no'] for binary questions.",
    ),
  priors: z
    .array(z.object({ outcomeId: slug, prior: z.number().min(0.01).max(0.99) }))
    .min(2)
    .max(6)
    .describe(
      "Base rate for each outcome BEFORE looking at any current evidence, from historical frequency and structure alone. Must roughly sum to 1.",
    ),
  priorRationale: z
    .string()
    .describe("Why those base rates — reference the reference class, not current news."),
  resolutionDate: z
    .string()
    .nullable()
    .describe("ISO 8601 date the event is expected to resolve, or null if genuinely unknown."),
  searchQueries: z
    .array(z.string().min(3).max(160))
    .min(2)
    .max(5)
    .describe(
      "Web search queries that would surface the most decision-relevant recent information. Vary the angle: official statements, reporting, and disconfirming evidence.",
    ),
});

export type EventUnderstanding = z.infer<typeof EventUnderstandingSchema>;

/** Step 3 — judge each retrieved source on its own terms. */
export const EvidenceAssessmentSchema = z.object({
  assessments: z.array(
    z.object({
      sourceIndex: z.number().int().min(0).describe("Index of the source in the supplied list."),
      summary: z
        .string()
        .max(320)
        .describe("What this source actually says about the event. Factual, no speculation."),
      supportsOutcomeId: slug
        .nullable()
        .describe("Which outcome this source points toward, or null if it is genuinely neutral."),
      strength: z
        .number()
        .min(0)
        .max(1)
        .describe("How much this source should move a forecaster: 0.1 chatter, 0.9 decisive."),
      reliability: z
        .number()
        .min(0)
        .max(1)
        .describe("Source quality: 0.95 primary/official, 0.7 reputable news, 0.2 rumour blog."),
      relevance: z
        .number()
        .min(0)
        .max(1)
        .describe("How directly this source bears on the specific question asked."),
    }),
  ),
});

export type EvidenceAssessments = z.infer<typeof EvidenceAssessmentSchema>;

/** Step 5 — explain a probability that has already been computed. */
export const ForecastNarrativeSchema = z.object({
  reasoning: z
    .string()
    .describe(
      "2–4 sentences explaining the forecast, grounded in the supplied evidence. Never claim certainty; refer to probability. Do not restate the percentage more than once.",
    ),
  factorsUp: z
    .array(z.object({ text: z.string().min(4).max(160), weight: z.number().min(0).max(1) }))
    .min(1)
    .max(4)
    .describe("Concrete factors raising the probability of the leading outcome."),
  factorsDown: z
    .array(z.object({ text: z.string().min(4).max(160), weight: z.number().min(0).max(1) }))
    .min(1)
    .max(4)
    .describe("Concrete factors lowering it. Never leave this empty — every forecast has risk."),
});

export type ForecastNarrative = z.infer<typeof ForecastNarrativeSchema>;
