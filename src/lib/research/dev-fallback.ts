import type {
  ExtractedDocument,
  FetchedDocument,
  ResearchProvider,
  SearchQuery,
  SearchResult,
} from "./types";

/**
 * Development fallback used when no research API key is configured.
 *
 * It performs NO web research. Everything it returns is synthetic and is
 * labelled as such all the way to the UI:
 *
 *   - `isDevFallback` is true on the provider, on every evidence item and on
 *     the resulting forecast;
 *   - source links point at `/dev-research/<angle>`, an in-app page explaining
 *     the situation, never at a real publisher;
 *   - source names read "Development fixture", never a real outlet.
 *
 * This exists so the app runs end-to-end locally. It must never be presented
 * as real research.
 */
export class DevFallbackResearchProvider implements ResearchProvider {
  readonly name = "dev-fallback";
  readonly isDevFallback = true;

  async search({ query, limit = 6 }: SearchQuery): Promise<SearchResult[]> {
    const topic = summariseQuery(query);
    const now = Date.now();

    return FIXTURE_ANGLES.slice(0, limit).map((angle, index) => ({
      title: `${angle.title} — ${topic}`,
      url: `/dev-research/${angle.id}`,
      snippet: `${angle.body} This text is a Predictly development fixture generated locally for the query "${query}". No web request was made and none of it should be read as reporting.`,
      publishedAt: new Date(now - (index + 1) * 3 * 86_400_000).toISOString(),
      score: Math.max(0.35, 0.9 - index * 0.09),
    }));
  }

  async fetch(url: string): Promise<FetchedDocument> {
    return {
      url,
      body: "Predictly development fixture. No document was fetched from the web.",
      contentType: "text/plain",
    };
  }

  async extract(doc: FetchedDocument): Promise<ExtractedDocument> {
    return { url: doc.url, title: "Development fixture", text: doc.body, publishedAt: null };
  }
}

/**
 * Angles chosen so the forecasting pipeline sees a realistic spread: supporting
 * evidence, opposing evidence, a base-rate note and a low-signal item.
 */
const FIXTURE_ANGLES = [
  {
    id: "precedent",
    title: "Historical precedent for this class of event",
    body: "Similar events in this category have resolved affirmatively in a clear majority of past instances over the last decade.",
  },
  {
    id: "official",
    title: "Most recent official statement on record",
    body: "The organisation directly responsible has publicly reaffirmed its current timeline and has not signalled a change.",
  },
  {
    id: "reporting",
    title: "Recent reporting pointing the other way",
    body: "People familiar with the process describe internal pressure that would push the outcome away from the officially stated position.",
  },
  {
    id: "market",
    title: "Aggregated expectations from observers",
    body: "Public commentary and forecasting communities are split, with a modest lean toward the affirmative outcome.",
  },
  {
    id: "structural",
    title: "Structural constraints on the timeline",
    body: "Fixed calendar constraints materially limit how far the outcome can move in either direction.",
  },
  {
    id: "weak",
    title: "Low-signal chatter",
    body: "Unattributed speculation circulating without corroboration; included to test how weak evidence is down-weighted.",
  },
] as const;

function summariseQuery(query: string): string {
  const cleaned = query.replace(/\s+/g, " ").trim();
  return cleaned.length > 70 ? `${cleaned.slice(0, 67)}…` : cleaned;
}
