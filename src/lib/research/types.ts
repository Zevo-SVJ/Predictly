/**
 * Provider-agnostic web research contract.
 *
 * Nothing above this layer knows whether results came from Tavily, Brave, or the
 * development fallback. Swapping providers is a one-line change in
 * `research/index.ts`.
 */

export interface SearchQuery {
  query: string;
  /** Cap on results for this query. */
  limit?: number;
  /** Only return documents published within this many days, when supported. */
  freshnessDays?: number;
}

export interface SearchResult {
  title: string;
  url: string;
  /** Provider-supplied snippet. May be empty; `extract` fills the gap. */
  snippet: string;
  publishedAt: string | null;
  /** Provider's own relevance score, normalised to 0–1 when available. */
  score: number | null;
}

export interface FetchedDocument {
  url: string;
  /** Raw response body. HTML for web pages. */
  body: string;
  contentType: string;
}

export interface ExtractedDocument {
  url: string;
  title: string;
  /** Readable plain text, whitespace-normalised and length-capped. */
  text: string;
  publishedAt: string | null;
}

export interface ResearchProvider {
  /** Stable identifier surfaced in the UI, e.g. "tavily". */
  readonly name: string;
  /** True when this provider does not perform real web research. */
  readonly isDevFallback: boolean;

  search(query: SearchQuery): Promise<SearchResult[]>;
  fetch(url: string): Promise<FetchedDocument>;
  extract(doc: FetchedDocument): Promise<ExtractedDocument>;
}

export class ResearchProviderError extends Error {
  constructor(
    message: string,
    readonly kind: "timeout" | "rate_limit" | "unauthorized" | "network" | "bad_response",
  ) {
    super(message);
    this.name = "ResearchProviderError";
  }
}
