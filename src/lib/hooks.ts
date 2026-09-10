"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Whether the visitor has asked for reduced motion.
 *
 * `useSyncExternalStore` rather than an effect: the server snapshot is `false`,
 * so the markup React renders on the server and on the first client pass agree,
 * and the real value arrives without a hydration mismatch. CSS handles reduced
 * motion for anything declarative; this exists for the cases where the timing
 * itself has to change, such as skipping a scripted replay.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(QUERY).matches
      : false),
    () => false,
  );
}
