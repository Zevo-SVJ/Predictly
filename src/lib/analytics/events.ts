/**
 * The complete set of product events Predictly tracks. Add sparingly.
 *
 * Every name here is fired somewhere in the app. An event that nothing emits is
 * a claim about instrumentation that does not exist, so removing a feature
 * removes its events with it.
 */
export const ANALYTICS_EVENTS = [
  "landing_view",
  "prediction_started",
  "prediction_completed",
  "prediction_failed",
  "prediction_saved",
  "prediction_shared",
  "signup_started",
  "signup_completed",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];
export type AnalyticsProps = Record<string, string | number | boolean | null>;
