import type { PredictionCategory } from "./types";

export * from "./types";

/**
 * Nine domains, each with a small cluster of recognisable marks.
 *
 * No `asset` is set on any mark. This environment has no access to the official
 * brand resources these would have to come from, and drawing substitutes by
 * hand would be both an approximation of a protected mark and a fabrication, so
 * each renders as its name set in type — the permitted neutral treatment.
 * Bitcoin carries a glyph because ₿ is a Unicode currency character (U+20BF)
 * and free to use.
 *
 * Cluster coordinates are hand-placed per category so each reads as a
 * composition rather than a row.
 */
export const CATEGORIES: PredictionCategory[] = [
  {
    id: "sports",
    name: "Sports",
    description: "Titles, transfers and championships, from the group stage to the final whistle.",
    question: "Who will win the 2026-27 UEFA Champions League?",
    marks: [
      { id: "champions-league", name: "Champions League", x: 2, y: 30, scale: "lg" },
      { id: "formula-1", name: "Formula 1", x: 58, y: 4, scale: "md" },
      { id: "us-open", name: "US Open", x: 64, y: 62, scale: "md" },
      { id: "ballon-dor", name: "Ballon d'Or", x: 18, y: 74, scale: "sm" },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    description: "Launches, delays and the products that reset a market.",
    question: "Will Apple unveil its first foldable iPhone at its September 2026 event?",
    marks: [
      { id: "apple", name: "Apple", x: 4, y: 12, scale: "lg" },
      { id: "google", name: "Google", x: 52, y: 46, scale: "md" },
      { id: "nvidia", name: "NVIDIA", x: 8, y: 70, scale: "md" },
      { id: "samsung", name: "Samsung", x: 62, y: 4, scale: "sm" },
    ],
  },
  {
    id: "politics",
    name: "Politics",
    description: "Elections, votes and decisions with a date attached.",
    question: "Which party will win the most seats at the next UK general election?",
    marks: [
      { id: "elections", name: "Elections", x: 3, y: 22, scale: "lg" },
      { id: "parliaments", name: "Parliaments", x: 44, y: 60, scale: "md" },
      { id: "referendums", name: "Referendums", x: 30, y: 4, scale: "sm" },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Awards, releases and the results everyone argues about beforehand.",
    question: "Which film will win Best Picture at the 2027 Academy Awards?",
    marks: [
      { id: "oscars", name: "The Oscars", x: 2, y: 16, scale: "lg" },
      { id: "grammys", name: "GRAMMYs", x: 54, y: 52, scale: "md" },
      { id: "netflix", name: "Netflix", x: 20, y: 74, scale: "md" },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Launches, leadership and the moves that reshape an industry.",
    question: "Will Nvidia end 2026 as the world's most valuable company?",
    marks: [
      { id: "earnings", name: "Earnings", x: 4, y: 20, scale: "lg" },
      { id: "ipos", name: "IPOs", x: 60, y: 8, scale: "md" },
      { id: "acquisitions", name: "Acquisitions", x: 22, y: 70, scale: "sm" },
    ],
  },
  {
    id: "science",
    name: "Science",
    description: "Missions, milestones and results the world is waiting on.",
    question: "Will a crewed Starship mission launch before the end of 2027?",
    marks: [
      { id: "nasa", name: "NASA", x: 6, y: 26, scale: "lg" },
      { id: "cern", name: "CERN", x: 56, y: 12, scale: "md" },
      { id: "spaceflight", name: "Spaceflight", x: 30, y: 70, scale: "sm" },
    ],
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Release dates, hardware and the delays nobody admits to yet.",
    question: "Will Grand Theft Auto VI release on its announced date?",
    marks: [
      { id: "playstation", name: "PlayStation", x: 2, y: 18, scale: "lg" },
      { id: "xbox", name: "Xbox", x: 62, y: 50, scale: "md" },
      { id: "nintendo", name: "Nintendo", x: 24, y: 72, scale: "md" },
    ],
  },
  {
    id: "crypto",
    name: "Crypto",
    description: "Protocol milestones, approvals and the thresholds people watch.",
    question: "Will Bitcoin reach $100,000 before the end of 2026?",
    marks: [
      { id: "bitcoin", name: "Bitcoin", glyph: "₿", x: 4, y: 24, scale: "lg" },
      { id: "ethereum", name: "Ethereum", x: 54, y: 58, scale: "md" },
    ],
  },
  {
    id: "culture",
    name: "Culture",
    description: "What breaks through, what lasts, and what the year is named after.",
    question: "Which word will be named Word of the Year for 2026?",
    marks: [
      { id: "word-of-the-year", name: "Word of the Year", x: 2, y: 28, scale: "md" },
      { id: "festivals", name: "Festivals", x: 58, y: 10, scale: "md" },
      { id: "charts", name: "Charts", x: 34, y: 70, scale: "sm" },
    ],
  },
];

export function findCategory(id: string) {
  return CATEGORIES.find((category) => category.id === id);
}
