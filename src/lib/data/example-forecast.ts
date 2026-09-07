import type { Forecast } from "@/lib/types";

/**
 * A worked example shown on the landing page.
 *
 * This is NOT engine output and the UI labels it "Example forecast" wherever it
 * appears. It is hand-authored so a first-time visitor can see the real shape
 * of a result before spending a minute on their own question.
 *
 * The sources below are genuine, publicly available articles with their real
 * titles, publishers, dates and URLs — nothing here is invented. The
 * probability is an editorial illustration of how the evidence reads, not a
 * number produced by `ForecastEngine`.
 */
export const EXAMPLE_FORECAST: Forecast = {
  id: "example-gta-vi-delay",
  slug: "will-gta-vi-be-delayed-again",
  question: "Will GTA VI be delayed again?",
  normalizedEvent:
    "Resolves YES if Rockstar or Take-Two publicly moves Grand Theft Auto VI off its stated 19 November 2026 release date before that date; NO if the game ships on 19 November 2026.",
  category: "Gaming",
  outcomes: [
    { id: "no", label: "No", probability: 0.78 },
    { id: "yes", label: "Yes", probability: 0.22 },
  ],
  headlineOutcomeId: "no",
  probability: 0.78,
  confidence: "medium",
  reasoning:
    "Rockstar has moved this date twice already, which is the single strongest argument for another slip. Against that, Take-Two reaffirmed 19 November 2026 on its August earnings call and anchored full-year bookings guidance to it, with pre-orders management called unprecedented. A publisher rarely reprices a fiscal year around a date it expects to miss, and delays announced inside three months of launch are historically rare, so the evidence leans clearly toward the game shipping on schedule without ruling out a late change.",
  factorsUp: [
    { text: "GTA VI has already slipped twice, from fall 2025 to May 2026 to November 2026.", weight: 0.85 },
    { text: "Rockstar has historically prioritised polish over announced dates, and said so explicitly when it last delayed.", weight: 0.55 },
    { text: "A November launch leaves no slack in the holiday window if certification or a late build issue appears.", weight: 0.35 },
  ],
  factorsDown: [
    { text: "Take-Two reiterated the 19 November 2026 date on its 7 August 2026 earnings call.", weight: 0.9 },
    { text: "Fiscal 2027 bookings guidance of $8.0–8.2B is built on the game shipping this fiscal year.", weight: 0.75 },
    { text: "Pre-orders are open and were described by management as at record industry levels.", weight: 0.5 },
  ],
  evidence: [
    {
      id: "ex-1",
      title: "GTA 6 Preorder Sales 'Unprecedented,' Take-Two Earnings Revealed",
      url: "https://variety.com/2026/gaming/news/gta-6-preorder-sales-take-two-earnings-1236829396/",
      sourceName: "Variety",
      publishedAt: "2026-08-07T00:00:00.000Z",
      summary:
        "On its 7 August 2026 earnings call Take-Two reaffirmed the 19 November 2026 launch and reported pre-order levels its CEO said the company and industry had not seen before, while describing itself as cautiously optimistic.",
      supportsOutcomeId: "no",
      strength: 0.8,
      reliability: 0.8,
      relevance: 0.95,
      isDevFallback: false,
    },
    {
      id: "ex-2",
      title: "Grand Theft Auto VI Is Delayed to November 2026",
      url: "https://www.bloomberg.com/news/articles/2025-11-06/-grand-theft-auto-vi-is-postponed-again-to-november-2026",
      sourceName: "Bloomberg",
      publishedAt: "2025-11-06T00:00:00.000Z",
      summary:
        "Rockstar pushed the game from May 2026 to 19 November 2026, the second delay after the original fall 2025 target — the base rate this forecast has to argue against.",
      supportsOutcomeId: "yes",
      strength: 0.7,
      reliability: 0.95,
      relevance: 0.85,
      isDevFallback: false,
    },
    {
      id: "ex-3",
      title: "Take-Two outlines net bookings target as GTA VI launch moves to November 2026",
      url: "https://seekingalpha.com/news/4518176-take-two-outlines-6_4b-6_5b-net-bookings-target-for-2026-as-gta-vi-launch-moves-to-november",
      sourceName: "Seeking Alpha",
      publishedAt: "2025-11-06T00:00:00.000Z",
      summary:
        "Take-Two restated multi-billion-dollar bookings targets around the November window, tying reported financial guidance directly to the release date.",
      supportsOutcomeId: "no",
      strength: 0.6,
      reliability: 0.65,
      relevance: 0.8,
      isDevFallback: false,
    },
    {
      id: "ex-4",
      title: "Grand Theft Auto VI delayed again — \"When we set a date, we really do believe in it\"",
      url: "https://www.thegamebusiness.com/p/grand-theft-auto-vi-delayed-again",
      sourceName: "The Game Business",
      publishedAt: "2025-11-07T00:00:00.000Z",
      summary:
        "Industry trade coverage of the November 2025 delay, including Take-Two's position that it commits to dates it believes in — evidence both of the delay history and of how the publisher frames its schedule.",
      supportsOutcomeId: null,
      strength: 0.45,
      reliability: 0.7,
      relevance: 0.7,
      isDevFallback: false,
    },
    {
      id: "ex-5",
      title: "Will Grand Theft Auto VI be delayed again until 2027? Rockstar Games' owners give fans the answer",
      url: "https://www.levelup.com/en/news/will-grand-theft-auto-vi-be-delayed-again-until-2027-rockstar-games-owners-give-fans-the-answer-they-were-waiting-for/",
      sourceName: "Level Up",
      publishedAt: "2026-08-08T00:00:00.000Z",
      summary:
        "Consumer games coverage summarising Take-Two's public position that no further delay is planned. Secondary reporting on the earnings call rather than an independent source.",
      supportsOutcomeId: "no",
      strength: 0.3,
      reliability: 0.45,
      relevance: 0.75,
      isDevFallback: false,
    },
  ],
  resolutionDate: "2026-11-19",
  resolutionStatus: "unresolved",
  resolvedOutcomeId: null,
  resolutionSource: null,
  resolvedAt: null,
  researchedAt: "2026-09-07T09:00:00.000Z",
  createdAt: "2026-09-07T09:00:00.000Z",
  userId: null,
  isDevFallback: false,
  providers: { research: "editorial-example", reasoning: "editorial-example" },
};
