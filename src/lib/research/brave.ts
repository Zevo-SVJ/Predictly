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

const BRAVE_SEARCH = "https://api.search.brave.com/res/v1/web/search";

interface BraveHit {
  title?: string;
  url?: string;
  description?: string;
  age?: string;
  page_age?: string;
}

/**
 * Brave gives search only, so this provider pairs it with a direct page fetch
 * and the local readability pass. Slower than Tavily per source, but a useful
 * second option and a demonstration that the pipeline is provider-agnostic.
 */
export class BraveResearchProvider implements ResearchProvider {
  readonly name = "brave";
  readonly isDevFallback = false;

  constructor(private readonly apiKey: string) {}

  async search({ query, limit = 8, freshnessDays }: SearchQuery): Promise<SearchResult[]> {
    const url = new URL(BRAVE_SEARCH);
    url.searchParams.set("q", query);
    url.searchParams.set("count", String(Math.min(limit, 20)));
    if (freshnessDays && freshnessDays <= 365) {
      url.searchParams.set("freshness", freshnessDays <= 7 ? "pw" : freshnessDays <= 31 ? "pm" : "py");
    }

    const response = await timedFetch(url.toString(), {
      trusted: true,
      timeoutMs: 15_000,
      headers: { accept: "application/json", "x-subscription-token": this.apiKey },
    });

    if (response.status === 401 || response.status === 403) {
      throw new ResearchProviderError("Brave rejected the API key", "unauthorized");
    }
    if (response.status === 429) {
      throw new ResearchProviderError("Brave rate limit reached", "rate_limit");
    }
    if (!response.ok) {
      throw new ResearchProviderError(`Brave returned ${response.status}`, "bad_response");
    }

    const payload = (await response.json()) as { web?: { results?: BraveHit[] } };
    return (payload.web?.results ?? [])
      .filter((hit): hit is BraveHit & { url: string } => Boolean(hit.url))
      .map((hit) => ({
        title: hit.title?.replace(/<[^>]+>/g, "").trim() || hit.url,
        url: hit.url,
        snippet: (hit.description ?? "").replace(/<[^>]+>/g, ""),
        publishedAt: parseBraveAge(hit.page_age ?? hit.age),
        score: null,
      }));
  }

  async fetch(url: string): Promise<FetchedDocument> {
    const response = await timedFetch(url, {
      timeoutMs: 10_000,
      headers: { "user-agent": "PredictlyBot/0.1 (+https://predictly.app)" },
    });
    if (!response.ok) {
      throw new ResearchProviderError(`Fetch of ${url} returned ${response.status}`, "bad_response");
    }
    return {
      url,
      body: (await response.text()).slice(0, 400_000),
      contentType: response.headers.get("content-type") ?? "text/html",
    };
  }

  async extract(doc: FetchedDocument): Promise<ExtractedDocument> {
    return {
      url: doc.url,
      title: extractTitle(doc.body),
      text: htmlToText(doc.body),
      publishedAt: extractPublishedAt(doc.body),
    };
  }
}

/** Brave returns either an ISO date or a relative string like "3 days ago". */
function parseBraveAge(value: string | undefined): string | null {
  if (!value) return null;
  const absolute = new Date(value);
  if (!Number.isNaN(absolute.getTime())) return absolute.toISOString();

  const relative = /^(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago$/i.exec(value.trim());
  if (!relative) return null;
  const amount = Number(relative[1]);
  const unitMs: Record<string, number> = {
    minute: 60_000,
    hour: 3_600_000,
    day: 86_400_000,
    week: 604_800_000,
    month: 2_592_000_000,
    year: 31_536_000_000,
  };
  const ms = unitMs[(relative[2] ?? "").toLowerCase()];
  return ms ? new Date(Date.now() - amount * ms).toISOString() : null;
}

export function createBraveProvider(): BraveResearchProvider | null {
  const key = serverEnv.braveApiKey();
  return key ? new BraveResearchProvider(key) : null;
}
