/**
 * Minimal readability pass.
 *
 * A full DOM parser is not worth the bundle for what the forecasting pipeline
 * needs: enough clean prose per source for the evaluator to judge what the
 * article says. Strips scripts/styles/nav chrome, decodes common entities and
 * collapses whitespace.
 */

const STRIP_BLOCKS =
  /<(script|style|noscript|svg|template|iframe|nav|footer|header|aside|form)\b[^>]*>[\s\S]*?<\/\1>/gi;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&hellip;": "…",
};

export function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&[a-z]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity);
}

export function extractTitle(html: string): string {
  const og = /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i.exec(html);
  if (og?.[1]) return decodeEntities(og[1]).trim();
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (title?.[1]) return decodeEntities(title[1]).trim();
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  if (h1?.[1]) return decodeEntities(h1[1].replace(/<[^>]+>/g, "")).trim();
  return "";
}

/** Best-effort publication date from the usual metadata slots. */
export function extractPublishedAt(html: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["'](?:pubdate|publish-date|date|dc\.date)["'][^>]+content=["']([^"']+)["']/i,
    /<time[^>]+datetime=["']([^"']+)["']/i,
    /"datePublished"\s*:\s*"([^"]+)"/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    const raw = match?.[1];
    if (!raw) continue;
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

export function htmlToText(html: string, maxChars = 6000): string {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(STRIP_BLOCKS, " ")
    .replace(/<\/(p|div|li|h[1-6]|tr|section|article)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeEntities(text)
    .replace(/[ \t ]+/g, " ")
    .replace(/\n\s*\n\s*/g, "\n")
    .trim()
    .slice(0, maxChars);
}

/** Human-readable publisher name derived from the URL host. */
export function sourceNameFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const parts = host.split(".");
    const core = parts.length > 2 && (parts[parts.length - 2] ?? "").length <= 3
      ? parts.slice(0, -2).join(".")
      : parts.slice(0, -1).join(".");
    const label = (core || host).split(".").pop() ?? host;
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return "Unknown source";
  }
}
