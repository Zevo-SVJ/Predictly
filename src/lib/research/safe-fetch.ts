import { ResearchProviderError } from "./provider";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
  "instance-data",
]);

/** IPv4 / IPv6 literals that must never be fetched from the server. */
const PRIVATE_IPV4 =
  /^(?:10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;

/**
 * Rejects any URL that could be used to reach internal infrastructure.
 *
 * The forecasting pipeline fetches URLs that ultimately originate from a search
 * provider, so this is the boundary that stops a poisoned search result from
 * turning into server-side request forgery.
 */
export function assertFetchableUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new ResearchProviderError(`Not a valid URL: ${rawUrl}`, "bad_response");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ResearchProviderError(`Blocked protocol: ${url.protocol}`, "bad_response");
  }

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith(".localhost") || host.endsWith(".internal")) {
    throw new ResearchProviderError(`Blocked host: ${host}`, "bad_response");
  }
  if (PRIVATE_IPV4.test(host)) {
    throw new ResearchProviderError(`Blocked private address: ${host}`, "bad_response");
  }
  // IPv6 loopback, link-local and unique-local ranges.
  if (host === "::1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) {
    throw new ResearchProviderError(`Blocked private address: ${host}`, "bad_response");
  }

  return url;
}

interface TimedFetchOptions extends RequestInit {
  timeoutMs?: number;
  /** Skip the SSRF guard for first-party provider API endpoints. */
  trusted?: boolean;
}

/** `fetch` with a hard timeout and, by default, the SSRF guard applied. */
export async function timedFetch(
  rawUrl: string,
  { timeoutMs = 10_000, trusted = false, ...init }: TimedFetchOptions = {},
): Promise<Response> {
  if (!trusted) assertFetchableUrl(rawUrl);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(rawUrl, { ...init, signal: controller.signal, redirect: "follow" });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ResearchProviderError(`Request to ${rawUrl} timed out`, "timeout");
    }
    throw new ResearchProviderError(
      `Network error for ${rawUrl}: ${error instanceof Error ? error.message : "unknown"}`,
      "network",
    );
  } finally {
    clearTimeout(timer);
  }
}
