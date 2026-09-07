import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** URL-safe slug, e.g. "Will GTA VI be delayed again?" → "will-gta-vi-be-delayed-again". */
export function slugify(input: string, maxLength = 60): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
  return slug || "forecast";
}

/** Short, URL-friendly, collision-resistant id. */
export function shortId(length = 10): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function formatPercent(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

/** Editorial date format used throughout the product, e.g. "8 Sep 2026". */
export function formatDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Plain-language reading of a probability, used next to the big number. */
export function probabilityVerdict(probability: number): string {
  if (probability >= 0.9) return "Very likely";
  if (probability >= 0.7) return "Likely";
  if (probability >= 0.55) return "Leaning yes";
  if (probability > 0.45) return "Toss-up";
  if (probability > 0.3) return "Leaning no";
  if (probability > 0.1) return "Unlikely";
  return "Very unlikely";
}
