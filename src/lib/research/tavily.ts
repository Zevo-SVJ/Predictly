import { serverEnv } from "@/lib/config";
import { extractPublishedAt, extractTitle, htmlToText } from "./html";
import { timedFetch } from "./safe-fetch";
import {
  ResearchProviderError,
  type ExtractedDocument,
  type FetchedDocument,
  type ResearchProvider,
  type SearchQuery,
  type SearchResult,
} from "./provider";

const TAVILY_SEARCH = "https://api.tavily.com/search";
const TAVILY_EXTRACT = "https://api.tavily.com/extract";

interface TavilyHit {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
  published_date?: string;
  raw_content?: string | null;
}

/**
 * Tavily is search-plus-extraction in one API, which suits the pipeline: one
 * call returns ranked results with clean content, so most sources never need a
 * separate page fetch.
 */
export class TavilyResearchProvider implements ResearchProvider {
  readonly name = "tavily";
  readonly isDevFallback = false;

  constructor(private readonly apiKey: string) {}

  async search({ query, limit = 8, freshnessDays }: SearchQuery): Promise<SearchResult[]> {
    const response = await timedFetch(TAVILY_SEARCH, {
      trusted: true,
      method: "POST",
      timeoutMs: 20_000,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: limit,
        search_depth: "advanced",
        include_answer: false,
        include_raw_content: true,
        topic: "news",
        ...(freshnessDays ? { days: freshnessDays } : {}),
      }),
    });

    if (response.status === 401 || response.status === 403) {
      throw new ResearchProviderError("Tavily rejected the API key", "unauthorized");
    }
    if (response.status === 429) {
      throw new ResearchProviderError("Tavily rate limit reached", "rate_limit");
    }
    if (!response.ok) {
      throw new ResearchProviderError(`Tavily returned ${response.status}`, "bad_response");
    }

    const payload = (await response.json()) as { results?: TavilyHit[] };
    return (payload.results ?? [])
      .filter((hit): hit is TavilyHit & { url: string } => Boolean(hit.url))
      .map((hit) => ({
        title: hit.title?.trim() || hit.url,
        url: hit.url,
        snippet: (hit.raw_content ?? hit.content ?? "").slice(0, 4000),
        publishedAt: normaliseDate(hit.published_date),
        score: typeof hit.score === "number" ? Math.max(0, Math.min(1, hit.score)) : null,
      }));
  }

  async fetch(url: string): Promise<FetchedDocument> {
    // Prefer Tavily's extractor: it handles paywalls and JS-heavy pages better
    // than a raw GET, and keeps our egress limited to one host.
    const response = await timedFetch(TAVILY_EXTRACT, {
      trusted: true,
      method: "POST",
      timeoutMs: 20_000,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ urls: [url] }),
    });

    if (response.ok) {
      const payload = (await response.json()) as {
        results?: { url?: string; raw_content?: string }[];
      };
      const content = payload.results?.[0]?.raw_content;
      if (content) return { url, body: content, contentType: "text/plain" };
    }

    const direct = await timedFetch(url, {
      timeoutMs: 10_000,
      headers: { "user-agent": "PredictlyBot/0.1 (+https://predictly.app)" },
    });
    if (!direct.ok) {
      throw new ResearchProviderError(`Fetch of ${url} returned ${direct.status}`, "bad_response");
    }
    return {
      url,
      body: (await direct.text()).slice(0, 400_000),
      contentType: direct.headers.get("content-type") ?? "text/html",
    };
  }

  async extract(doc: FetchedDocument): Promise<ExtractedDocument> {
    const isHtml = doc.contentType.includes("html") || /<html|<body|<div/i.test(doc.body);
    return {
      url: doc.url,
      title: isHtml ? extractTitle(doc.body) : "",
      text: isHtml ? htmlToText(doc.body) : doc.body.slice(0, 6000),
      publishedAt: isHtml ? extractPublishedAt(doc.body) : null,
    };
  }
}

function normaliseDate(value: string | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function createTavilyProvider(): TavilyResearchProvider | null {
  const key = serverEnv.tavilyApiKey();
  return key ? new TavilyResearchProvider(key) : null;
}
