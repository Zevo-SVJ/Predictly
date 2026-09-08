"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { calculateProbability } from "@/lib/forecast/probability";
import type { EvidenceItem } from "@/lib/types";
import { cn, formatPercent, probabilityVerdict } from "@/lib/utils";

/**
 * The forecast, and why it moves.
 *
 * Each step feeds one more piece of evidence into `calculateProbability` — the
 * same function the server runs — so the number you watch change is produced by
 * the real aggregation, not a scripted animation. That is also the honest way
 * to show a probability updating: nothing here is a stored sequence.
 *
 * The evidence describes KINDS of source rather than naming publications, for
 * the same reason as the research layer above.
 */
const OUTCOMES = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
];
const PRIORS = [
  { outcomeId: "yes", prior: 0.5 },
  { outcomeId: "no", prior: 0.5 },
];

interface Signal {
  label: string;
  supports: "yes" | "no";
  strength: number;
  reliability: number;
  relevance: number;
  ageDays: number;
}

/** Ordered so the sequence tells a story: strong, corroborating, then a check. */
const SIGNALS: Signal[] = [
  { label: "Base rate only — no evidence yet", supports: "yes", strength: 0, reliability: 0, relevance: 0, ageDays: 0 },
  { label: "An official announcement confirms the date", supports: "yes", strength: 0.85, reliability: 0.95, relevance: 0.95, ageDays: 2 },
  { label: "Several outlets report it independently", supports: "yes", strength: 0.7, reliability: 0.78, relevance: 0.9, ageDays: 4 },
  { label: "The organisation has still not confirmed", supports: "no", strength: 0.6, reliability: 0.9, relevance: 0.85, ageDays: 5 },
];

const STAGES = ["Signals", "Evidence", "Context", "Forecast"];

export function ForecastMoment() {
  const [step, setStep] = useState(1);
  const now = useMemo(() => new Date("2026-09-08T12:00:00Z"), []);

  const result = useMemo(() => {
    const evidence: EvidenceItem[] = SIGNALS.slice(1, step + 1).map((signal, index) => ({
      id: `s${index}`,
      title: signal.label,
      url: "",
      sourceName: "",
      publishedAt: new Date(now.getTime() - signal.ageDays * 86_400_000).toISOString(),
      summary: signal.label,
      supportsOutcomeId: signal.supports,
      stance: signal.supports === "yes" ? "supports" : "opposes",
      strength: signal.strength,
      reliability: signal.reliability,
      relevance: signal.relevance,
    }));
    return calculateProbability(OUTCOMES, PRIORS, evidence, now);
  }, [step, now]);

  const probability = result.outcomes.find((o) => o.id === "yes")?.probability ?? 0.5;
  const reduceMotion = usePrefersReducedMotion();
  const tweened = useTween(probability, reduceMotion);
  const shown = reduceMotion ? probability : tweened;

  return (
    <section className="grain relative overflow-hidden border-t border-line py-16 sm:py-24">
      <div className="container-canvas relative">
        <div className="max-w-[40ch]">
          <p className="eyebrow">The forecast</p>
          <h2
            className="mt-4 font-semibold leading-[0.92] tracking-[-0.045em]"
            style={{ fontSize: "var(--text-h2)" }}
          >
            The future moves. So does the forecast.
          </h2>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* The number */}
          <div>
            <p
              className="font-semibold leading-[0.82] tabular-nums text-lime"
              style={{ fontSize: "var(--text-figure)" }}
            >
              {formatPercent(shown)}
            </p>
            <p className="mt-5 text-[1.35rem] font-medium tracking-[-0.02em]">
              {probabilityVerdict(probability)}
            </p>

            <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-elevated">
              <span
                className="block h-full rounded-full bg-lime transition-[width] duration-700 ease-out"
                style={{ width: `${probability * 100}%` }}
              />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <dt className="eyebrow">Confidence</dt>
                <dd className="mt-1.5 text-[15px] capitalize text-fg">{result.confidence}</dd>
              </div>
              <div>
                <dt className="eyebrow">Sources counted</dt>
                <dd className="mt-1.5 text-[15px] tabular-nums text-fg">
                  {result.diagnostics.usedSources}
                </dd>
              </div>
            </dl>
          </div>

          {/* The progression */}
          <div>
            <ol className="flex flex-wrap gap-x-5 gap-y-1.5">
              {STAGES.map((stage, index) => (
                <li
                  key={stage}
                  className={cn(
                    "eyebrow transition-colors duration-300",
                    index <= step ? "text-lime/80" : "text-faint/50",
                  )}
                >
                  {stage}
                </li>
              ))}
            </ol>

            <ul className="mt-7">
              {SIGNALS.map((signal, index) => {
                const counted = index <= step;
                return (
                  <li key={signal.label}>
                    <button
                      type="button"
                      onClick={() => setStep(index)}
                      aria-pressed={counted}
                      className={cn(
                        "flex w-full items-baseline gap-4 border-t border-line py-4 text-left transition-opacity duration-300",
                        counted ? "opacity-100" : "opacity-45 hover:opacity-75",
                      )}
                    >
                      <span className="font-mono text-[11px] tabular-nums text-faint">
                        0{index + 1}
                      </span>
                      <span className="flex-1 text-[14.5px] leading-snug text-fg">
                        {signal.label}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[11px] uppercase tracking-[0.14em]",
                          counted ? "text-lime/70" : "text-faint",
                        )}
                      >
                        {counted ? "In" : "Out"}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li className="border-t border-line" aria-hidden />
            </ul>

            <p className="mt-6 text-[12.5px] leading-relaxed text-faint">
              Step through the evidence — the number is recomputed each time by
              the same code that runs a real forecast. Illustrative sources; a
              real forecast cites real ones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Tracks `prefers-reduced-motion` without a server/client render mismatch. */
function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Eases the displayed value so the probability counts rather than jumping. */
function useTween(target: number, disabled: boolean, duration = 560): number {
  const [value, setValue] = useState(target);
  const frame = useRef<number | null>(null);
  const from = useRef(target);

  useEffect(() => {
    if (disabled) return;

    const start = performance.now();
    const origin = from.current;
    const step = (time: number) => {
      const t = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = origin + (target - origin) * eased;
      setValue(next);
      from.current = next;
      if (t < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, disabled]);

  return value;
}
