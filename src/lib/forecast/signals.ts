import type { ForecastFactor, ForecastResult } from "@/lib/types";

/**
 * A signal is one directional pressure on the forecast, compressed to a label
 * short enough to scan on a phone.
 *
 * Signals are derived, never authored: every one comes from a `ForecastFactor`
 * the reasoning step produced from real evidence. The label is a compression of
 * `detail`, and `detail` is always shown next to it, so nothing is asserted
 * here that the forecast doesn't already say in full.
 */
export interface Signal {
  id: string;
  /** Compressed label, e.g. "RECENT FORM". */
  label: string;
  /** The factor text the label was compressed from. Always displayed. */
  detail: string;
  /** Which way this pushes the headline outcome. */
  direction: "up" | "down";
  /** The factor's own weight, 0–1. Drives the bar. */
  weight: number;
}

/**
 * Words safe to drop from either end of a label.
 *
 * Only articles, possessives and demonstratives — negations and pronouns stay,
 * because dropping "no" from "No production disruption reported" would invert
 * the meaning of the label.
 */
const EDGE_NOISE = new Set([
  "a", "an", "the", "his", "her", "its", "their", "this", "that", "these", "those",
  "of", "in", "on", "at", "to", "for", "with", "by", "from", "has", "have", "had",
  "is", "are", "was", "were", "and", "or",
]);

/**
 * Cuts a factor sentence down to a scannable label.
 *
 * Deterministic and lossy on purpose — it takes the head of the first clause,
 * drops leading filler and keeps at most three words. The full sentence
 * survives as `detail`, so compression can never change what is claimed.
 */
export function toSignalLabel(text: string): string {
  const head =
    text.split(/[,;:—–(]|\s+\b(?:because|which|after|since|while|but|and)\b/i)[0] ?? text;

  const words = head
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  while (words.length > 1 && EDGE_NOISE.has((words[0] ?? "").toLowerCase())) {
    words.shift();
  }

  const kept = words.slice(0, 3);
  // A label ending on a preposition or auxiliary reads as a truncation rather
  // than a name for the signal, so trim back off the tail too.
  while (kept.length > 1 && EDGE_NOISE.has((kept[kept.length - 1] ?? "").toLowerCase())) {
    kept.pop();
  }

  const label = kept
    .join(" ")
    .replace(/[^\p{L}\p{N}'’\- ]/gu, "")
    .trim();

  return (label || head.trim().slice(0, 24) || "Signal").toUpperCase();
}

function toSignals(
  factors: ForecastFactor[],
  direction: Signal["direction"],
): Signal[] {
  return factors
    .filter((factor) => factor.text.trim().length > 0)
    .map((factor, index) => ({
      id: `${direction}-${index}`,
      label: toSignalLabel(factor.text),
      detail: factor.text.trim(),
      direction,
      weight: Math.min(1, Math.max(0, factor.weight)),
    }));
}

/**
 * The forecast's factors, interleaved into one weight-ordered list.
 *
 * Both directions share a single list because that is how a reader actually
 * weighs them: the strongest pressure first, whichever way it points.
 */
export function deriveSignals(
  forecast: Pick<ForecastResult, "factorsFor" | "factorsAgainst">,
  limit = 6,
): Signal[] {
  return [
    ...toSignals(forecast.factorsFor, "up"),
    ...toSignals(forecast.factorsAgainst, "down"),
  ]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}
