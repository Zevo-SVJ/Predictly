import { sourceNameFromUrl } from "./html";
import type { SearchResult } from "./provider";

/** A search hit after cleaning, before dedup and extraction. */
export interface NormalizedSource {
  title: string;
  url: string;
  canonicalUrl: string;
  sourceName: string;
  publishedAt: string | null;
  snippet: string;
  score: number | null;
}

/**
 * Brings provider-specific hits onto one shape: trimmed text, a real publisher
 * name, an ISO date where one can be parsed, and a canonical URL used for
 * deduplication.
 */
export function normalizeResults(results: SearchResult[]): NormalizedSource[] {
  const normalized: NormalizedSource[] = [];

  for (const result of results) {
    const url = result.url?.trim();
    if (!url) continue;

    const canonicalUrl = canonicalise(url);
    if (!canonicalUrl) continue;

    normalized.push({
      title: cleanText(result.title) || url,
      url,
      canonicalUrl,
      sourceName: sourceNameFromUrl(url),
      publishedAt: toIsoDate(result.publishedAt),
      snippet: cleanText(result.snippet),
      score: typeof result.score === "number" ? clamp01(result.score) : null,
    });
  }

  return normalized;
}

/** Host + path with tracking params, fragments and trailing slashes removed. */
export function canonicalise(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const path = url.pathname.replace(/\/+$/, "");
    return `${host}${path}`;
  } catch {
    return null;
  }
}

function cleanText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toIsoDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  // Guard against providers returning absurd dates.
  const year = parsed.getUTCFullYear();
  if (year < 1990 || year > new Date().getUTCFullYear() + 2) return null;
  return parsed.toISOString();
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
