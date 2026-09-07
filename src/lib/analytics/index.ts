"use client";

import type { AnalyticsEvent, AnalyticsProps } from "./events";

export type { AnalyticsEvent, AnalyticsProps } from "./events";

/**
 * Analytics abstraction.
 *
 * Deliberately thin: one `track` call, one place to wire a real destination.
 * Today it forwards to whichever privacy-friendly script is on the page
 * (Plausible or Umami) and otherwise logs in development. No vendor SDK is
 * bundled, so this costs nothing when analytics isn't configured.
 */
interface AnalyticsWindow extends Window {
  plausible?: (event: string, options?: { props: AnalyticsProps }) => void;
  umami?: { track: (event: string, data?: AnalyticsProps) => void };
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;

  try {
    if (w.plausible) w.plausible(event, { props });
    else if (w.umami) w.umami.track(event, props);
    else if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, props);
    }
  } catch {
    // Analytics must never break the product.
  }
}
