import type { Confidence, EvidenceItem, Outcome } from "@/lib/types";

/**
 * Evidence aggregation.
 *
 * The language model interprets the question and judges each source in
 * isolation; it never states the final number. This module turns those
 * per-source judgements into a probability with ordinary arithmetic, which
 * means the result is reproducible, testable, and inspectable in the UI.
 *
 * Method: a Bayesian-style update in log-odds space.
 *
 *   1. Start from the structural base rate for each outcome (the prior).
 *   2. Give every source a weight = strength × reliability × relevance × recency.
 *   3. Move the log-odds of the outcome each source supports by that weight.
 *   4. Damp the total shift with tanh so a pile of weak, correlated sources
 *      cannot manufacture a 99% forecast.
 *   5. Renormalise and clamp away from 0 and 1 — nothing here is certain.
 */

/** How many log-odds one unit of perfect evidence is worth. */
const EVIDENCE_GAIN = 1.15;
/** Ceiling on the total log-odds move, in either direction. */
const MAX_SHIFT = 2.2;
/** Probabilities are never reported outside this band. */
const FLOOR = 0.02;
const CEILING = 0.97;
/** Evidence older than this contributes at the minimum recency weight. */
const RECENCY_HALF_LIFE_DAYS = 45;
const MIN_RECENCY_WEIGHT = 0.35;

export interface PriorInput {
  outcomeId: string;
  prior: number;
}

export interface ProbabilityResult {
  outcomes: Outcome[];
  headlineOutcomeId: string;
  probability: number;
  confidence: Confidence;
  /** Diagnostics, useful for debugging and future calibration work. */
  diagnostics: {
    totalWeight: number;
    agreement: number;
    meanReliability: number;
    meanRecency: number;
    usedSources: number;
  };
}

/**
 * Recency weight, decaying smoothly with a 45-day half-life and never falling
 * below `MIN_RECENCY_WEIGHT` — old evidence still counts, it just counts less.
 */
export function recencyWeight(publishedAt: string | null, now: Date): number {
  if (!publishedAt) return 0.6;
  const published = new Date(publishedAt).getTime();
  if (Number.isNaN(published)) return 0.6;

  const ageDays = Math.max(0, (now.getTime() - published) / 86_400_000);
  const decayed = Math.pow(0.5, ageDays / RECENCY_HALF_LIFE_DAYS);
  return MIN_RECENCY_WEIGHT + (1 - MIN_RECENCY_WEIGHT) * decayed;
}

const toLogOdds = (p: number) => Math.log(p / (1 - p));
const toProbability = (l: number) => 1 / (1 + Math.exp(-l));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function calculateProbability(
  outcomeDefs: { id: string; label: string }[],
  priors: PriorInput[],
  evidence: EvidenceItem[],
  now = new Date(),
): ProbabilityResult {
  const priorById = new Map(priors.map((p) => [p.outcomeId, p.prior]));
  const uniformPrior = 1 / Math.max(1, outcomeDefs.length);

  // Normalise the priors so they form a distribution even if the model's
  // numbers were only roughly consistent.
  const rawPriors = outcomeDefs.map((o) => clamp(priorById.get(o.id) ?? uniformPrior, 0.01, 0.99));
  const priorSum = rawPriors.reduce((a, b) => a + b, 0);
  const normalisedPriors = rawPriors.map((p) => clamp(p / priorSum, 0.02, 0.98));

  // One signed weight per outcome, accumulated across sources.
  const shiftByOutcome = new Map(outcomeDefs.map((o) => [o.id, 0]));
  let totalWeight = 0;
  let reliabilitySum = 0;
  let recencySum = 0;
  let usedSources = 0;

  for (const item of evidence) {
    const recency = recencyWeight(item.publishedAt, now);
    const weight = item.strength * item.reliability * item.relevance * recency;
    if (weight <= 0.01) continue;

    usedSources += 1;
    totalWeight += weight;
    reliabilitySum += item.reliability;
    recencySum += recency;

    if (item.supportsOutcomeId && shiftByOutcome.has(item.supportsOutcomeId)) {
      shiftByOutcome.set(
        item.supportsOutcomeId,
        (shiftByOutcome.get(item.supportsOutcomeId) ?? 0) + weight,
      );
    }
  }

  // Each outcome's evidence is scored against the best competing outcome, so a
  // source only helps insofar as it beats the alternatives.
  const posterior = outcomeDefs.map((outcome, index) => {
    const forThis = shiftByOutcome.get(outcome.id) ?? 0;
    const bestRival = Math.max(
      0,
      ...outcomeDefs.filter((o) => o.id !== outcome.id).map((o) => shiftByOutcome.get(o.id) ?? 0),
    );
    const net = forThis - bestRival;
    // tanh damping: diminishing returns as evidence accumulates.
    const shift = MAX_SHIFT * Math.tanh((net * EVIDENCE_GAIN) / MAX_SHIFT);
    const prior = normalisedPriors[index] ?? uniformPrior;
    return { outcome, value: toProbability(toLogOdds(prior) + shift) };
  });

  const sum = posterior.reduce((acc, p) => acc + p.value, 0) || 1;
  const outcomes: Outcome[] = posterior.map((p) => ({
    id: p.outcome.id,
    label: p.outcome.label,
    probability: clamp(p.value / sum, FLOOR, CEILING),
  }));

  // Renormalise once more after clamping so the set still sums to 1.
  const clampedSum = outcomes.reduce((acc, o) => acc + o.probability, 0) || 1;
  for (const outcome of outcomes) outcome.probability = outcome.probability / clampedSum;

  const headline = outcomes.reduce((best, o) => (o.probability > best.probability ? o : best));

  const meanReliability = usedSources ? reliabilitySum / usedSources : 0;
  const meanRecency = usedSources ? recencySum / usedSources : 0;
  const agreement = evidenceAgreement(shiftByOutcome, totalWeight);

  return {
    outcomes,
    headlineOutcomeId: headline.id,
    probability: headline.probability,
    confidence: scoreConfidence({ usedSources, meanReliability, meanRecency, agreement }),
    diagnostics: { totalWeight, agreement, meanReliability, meanRecency, usedSources },
  };
}

/**
 * How concentrated the evidence is on one outcome, 0 (evenly split) to 1
 * (unanimous). Split evidence is a reason to be less confident in the forecast,
 * independent of where the probability lands.
 */
function evidenceAgreement(shifts: Map<string, number>, totalWeight: number): number {
  if (totalWeight <= 0) return 0;
  const values = [...shifts.values()];
  const top = Math.max(0, ...values);
  const rest = values.reduce((a, b) => a + b, 0) - top;
  return clamp((top - rest) / totalWeight, 0, 1);
}

/**
 * Confidence is about the forecast, not the event: a 50/50 coin flip can be a
 * high-confidence forecast, and an 80% call built on two stale blog posts is a
 * low-confidence one.
 */
export function scoreConfidence(input: {
  usedSources: number;
  meanReliability: number;
  meanRecency: number;
  agreement: number;
}): Confidence {
  const breadth = clamp(input.usedSources / 6, 0, 1);
  const score =
    0.3 * breadth + 0.3 * input.meanReliability + 0.2 * input.meanRecency + 0.2 * input.agreement;

  if (input.usedSources < 3 || score < 0.45) return "low";
  // A forecast resting entirely on old evidence cannot be high-confidence,
  // however reputable and unanimous those sources are: the world has had time
  // to move since they were written.
  if (input.meanRecency < 0.5) return "medium";
  if (score < 0.68) return "medium";
  return "high";
}
