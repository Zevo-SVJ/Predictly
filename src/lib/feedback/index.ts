/**
 * Real feedback from real people who used Predictly.
 *
 * THIS LIST IS EMPTY ON PURPOSE.
 *
 * Predictly has not launched, so nobody has used it yet and there is nothing
 * truthful to show. Writing plausible quotes here — even obviously
 * "placeholder" ones — would put fabricated social proof on a public page,
 * which is the one thing a forecasting product cannot afford to do. The section
 * renders nothing while this array is empty and appears the moment it isn't.
 *
 * To add an entry, every field below must come from an actual person:
 *
 *   1. They said it. Quote them exactly, or edit only for length and typos.
 *   2. They agreed to be quoted publicly, by this name, in this context.
 *      Feedback given in a DM is not public permission.
 *   3. `askedAbout` is the subject they actually asked Predictly about.
 *   4. `source` records where it came from, so any claim stays checkable.
 *
 * Prefer specifics — surprise at the research, a probability that was
 * genuinely useful, evidence they hadn't seen — over compliments.
 */
export interface Feedback {
  id: string;
  /** Exact words, edited only for length or typos. */
  quote: string;
  /** As they agreed to be credited. */
  name: string;
  /** Optional, only with permission. */
  role?: string;
  handle?: string;
  /** Where the feedback came from, e.g. "Beta email, 12 Sep 2026". */
  source: string;
  /** The subject they asked about, e.g. "Apple" or "Champions League". */
  askedAbout?: string;
}

export const FEEDBACK: Feedback[] = [];

export function getFeedback(): Feedback[] {
  return FEEDBACK;
}
