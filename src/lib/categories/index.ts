import type { BrandMarkRef, MarkPlacement, PredictionCategory } from "./types";

export * from "./types";

/**
 * A deliberately small set of highly recognisable subjects — eight, across six
 * domains. Breadth is communicated by the range, not by volume.
 *
 * No `asset` is set on any mark. This environment has no access to the official
 * brand resources these would have to come from, and drawing substitutes by
 * hand would be both an approximation of a protected mark and a fabrication.
 * Each therefore renders as its name in type, which is the permitted neutral
 * representation. Bitcoin carries a glyph because ₿ is a Unicode currency
 * character (U+20BF) and free to use.
 */
export const CATEGORIES: PredictionCategory[] = [
  {
    id: "sports",
    name: "Sports",
    marks: [
      {
        id: "champions-league",
        name: "Champions League",
        question: "Who will win the 2026-27 UEFA Champions League?",
      },
      {
        id: "formula-1",
        name: "Formula 1",
        question: "Who will win the 2026 Formula 1 World Drivers' Championship?",
      },
      {
        id: "us-open",
        name: "US Open",
        question: "Who will win the 2026 US Open men's singles title?",
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    marks: [
      {
        id: "apple",
        name: "Apple",
        question: "Will Apple unveil its first foldable iPhone at its September 2026 event?",
      },
    ],
  },
  {
    id: "ai",
    name: "AI",
    marks: [
      {
        id: "openai",
        name: "OpenAI",
        question:
          "Will AI assistants account for more than 10% of web search referrals by the end of 2027?",
      },
    ],
  },
  {
    id: "markets",
    name: "Markets",
    marks: [
      {
        id: "bitcoin",
        name: "Bitcoin",
        glyph: "₿",
        question: "Will Bitcoin reach $100,000 before the end of 2026?",
      },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    marks: [
      {
        id: "oscars",
        name: "The Oscars",
        question: "Which film will win Best Picture at the 2027 Academy Awards?",
      },
    ],
  },
  {
    id: "science",
    name: "Science",
    marks: [
      {
        id: "nasa",
        name: "NASA",
        question: "Will a crewed Starship mission launch before the end of 2027?",
      },
    ],
  },
];

/** Flat lookup, in the order the field presents them. */
export const MARKS: (BrandMarkRef & { categoryName: string })[] = CATEGORIES.flatMap(
  (category) => category.marks.map((mark) => ({ ...mark, categoryName: category.name })),
);

export function findMark(id: string) {
  return MARKS.find((mark) => mark.id === id);
}

/**
 * Hand-placed so the field reads as a composition rather than a scatter: an
 * asymmetric descent with the largest mark anchoring the left and the smaller
 * ones holding the corners.
 *
 * `x` is the label's LEFT edge, so each entry is chosen against how wide that
 * word actually renders — "Champions League" at xl occupies roughly two thirds
 * of the field by itself, which is what a naive grid of positions collides with.
 */
export const FIELD_PLACEMENT: MarkPlacement[] = [
  { markId: "apple", x: 52, y: 4, scale: "lg" },
  { markId: "nasa", x: 86, y: 11, scale: "sm" },
  { markId: "champions-league", x: 3, y: 24, scale: "xl" },
  { markId: "openai", x: 76, y: 31, scale: "md" },
  { markId: "formula-1", x: 22, y: 50, scale: "lg" },
  { markId: "oscars", x: 72, y: 57, scale: "sm" },
  { markId: "bitcoin", x: 4, y: 72, scale: "md" },
  { markId: "us-open", x: 44, y: 84, scale: "md" },
];
