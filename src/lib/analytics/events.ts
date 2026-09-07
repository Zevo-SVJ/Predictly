/** The complete set of product events Predictly tracks. Add sparingly. */
export const ANALYTICS_EVENTS = [
  "landing_view",
  "prediction_started",
  "prediction_completed",
  "prediction_failed",
  "prediction_saved",
  "prediction_shared",
  "trending_event_clicked",
  "signup_started",
  "signup_completed",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];
export type AnalyticsProps = Record<string, string | number | boolean | null>;
