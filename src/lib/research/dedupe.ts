import type { NormalizedSource } from "./normalize";

/**
 * Removes duplicate coverage, then ranks what is left.
 *
 * Two things get collapsed: the same article reached by different URLs, and
 * the same story syndicated under a near-identical headline. Wire copy
 * republished by ten outlets is one piece of evidence, not ten, and treating it
 * as ten is exactly how a forecast ends up falsely confident.
 */
export function dedupeAndRank(sources: NormalizedSource[], now = new Date()): NormalizedSource[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const unique: NormalizedSource[] = [];

  for (const source of sources) {
    const titleKey = titleFingerprint(source.title);
    if (seenUrls.has(source.canonicalUrl)) continue;
    if (titleKey && seenTitles.has(titleKey)) continue;

    seenUrls.add(source.canonicalUrl);
    if (titleKey) seenTitles.add(titleKey);
    unique.push(source);
  }

  return unique.sort((a, b) => rank(b, now) - rank(a, now));
}

/**
 * Headline fingerprint: lowercase, stripped of punctuation and stopwords, so
 * "Yamal wins the Ballon d'Or" and "Yamal Wins Ballon d'Or" collapse together.
 */
function titleFingerprint(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
  // Too short to fingerprint safely — better a duplicate than a false collapse.
  if (words.length < 4) return "";
  return words.slice(0, 8).sort().join(" ");
}

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "will", "has", "have",
  "was", "were", "are", "his", "her", "its", "not", "but", "you", "who", "how",
]);

/** Provider relevance, plus a bonus for recency — current events move fast. */
function rank(source: NormalizedSource, now: Date): number {
  const base = source.score ?? 0.5;
  if (!source.publishedAt) return base;

  const ageDays = (now.getTime() - new Date(source.publishedAt).getTime()) / 86_400_000;
  if (Number.isNaN(ageDays)) return base;
  return base + 0.35 * Math.pow(0.5, Math.max(0, ageDays) / 30);
}
