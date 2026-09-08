"use client";

import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { calculateProbability } from "@/lib/forecast/probability";
import type { EvidenceItem } from "@/lib/types";
import { cn, formatPercent, probabilityVerdict } from "@/lib/utils";

/**
 * The trust argument, made by running the actual engine.
 *
 * Toggling a row re-runs `calculateProbability` — the same function the server
 * uses — live in the browser, so the number you watch move is produced by the
 * real aggregation, not by a scripted animation.
 *
 * The evidence rows describe KINDS of evidence, not specific articles. That is
 * deliberate: inventing plausible headlines, outlets, dates or URLs to fill this
 * section would be exactly the fabrication the product exists to avoid. The
 * section is labelled illustrative for the same reason.
 */

const OUTCOMES = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
];
const PRIORS = [
  { outcomeId: "yes", prior: 0.5 },
  { outcomeId: "no", prior: 0.5 },
];

interface DemoEvidence {
  id: string;
  label: string;
  detail: string;
  supports: "yes" | "no";
  strength: number;
  reliability: number;
  relevance: number;
  ageDays: number;
}

/** Ordered so switching them on tells a story: strong, then weak, then counter. */
const EVIDENCE: DemoEvidence[] = [
  {
    id: "official",
    label: "An official announcement confirms the date",
    detail: "Primary source · published this week",
    supports: "yes",
    strength: 0.85,
    reliability: 0.95,
    relevance: 0.95,
    ageDays: 3,
  },
  {
    id: "independent",
    label: "Several outlets report it independently",
    detail: "Established reporting · named sourcing",
    supports: "yes",
    strength: 0.7,
    reliability: 0.78,
    relevance: 0.9,
    ageDays: 6,
  },
  {
    id: "rumour",
    label: "An unattributed rumour is circulating",
    detail: "Low-confidence source · no corroboration",
    supports: "yes",
    strength: 0.2,
    reliability: 0.18,
    relevance: 0.6,
    ageDays: 2,
  },
  {
    id: "denial",
    label: "The organisation has not confirmed it",
    detail: "Primary source · absence of confirmation",
    supports: "no",
    strength: 0.6,
    reliability: 0.9,
    relevance: 0.85,
    ageDays: 4,
  },
  {
    id: "precedent",
    label: "A comparable plan slipped last year",
    detail: "Reference class · 14 months old",
    supports: "no",
    strength: 0.55,
    reliability: 0.7,
    relevance: 0.7,
    ageDays: 420,
  },
];

function toEvidenceItem(item: DemoEvidence, now: Date): EvidenceItem {
  return {
    id: item.id,
    title: item.label,
    url: "",
    sourceName: "",
    publishedAt: new Date(now.getTime() - item.ageDays * 86_400_000).toISOString(),
    summary: item.detail,
    supportsOutcomeId: item.supports,
    stance: item.supports === "yes" ? "supports" : "opposes",
    strength: item.strength,
    reliability: item.reliability,
    relevance: item.relevance,
  };
}

export function NotAGuess() {
  const [active, setActive] = useState<string[]>(["official", "independent"]);

  // Fixed reference time so recency weighting is stable across renders.
  const now = useMemo(() => new Date("2026-09-08T12:00:00Z"), []);

  const result = useMemo(() => {
    const evidence = EVIDENCE.filter((item) => active.includes(item.id)).map((item) =>
      toEvidenceItem(item, now),
    );
    return calculateProbability(OUTCOMES, PRIORS, evidence, now);
  }, [active, now]);

  const yes = result.outcomes.find((outcome) => outcome.id === "yes");
  const probability = yes?.probability ?? 0.5;
  const reduceMotion = usePrefersReducedMotion();
  const tweened = useTween(probability, reduceMotion);
  // Derived rather than assigned in an effect: with reduced motion the value is
  // simply the target, so there is nothing to animate and nothing to sync.
  const shown = reduceMotion ? probability : tweened;

  function toggle(id: string) {
    setActive((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <section className="section-y border-b border-line">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="font-semibold leading-[0.92]" style={{ fontSize: "var(--text-h2)" }}>
            Not a guess.
          </h2>
          <p className="max-w-[40ch] text-[14.5px] leading-relaxed text-muted">
            Predictly researches what is happening now, weighs each source, and
            turns the evidence into a probability. Switch the evidence on and off
            — the number is recomputed by the same code that runs a real forecast.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          {/* The number */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Probability</p>
            <p
              className="mt-4 font-semibold leading-[0.82] tabular-nums text-lime"
              style={{ fontSize: "var(--text-figure)" }}
            >
              {formatPercent(shown)}
            </p>
            <p className="mt-4 text-[15px] text-fg">{probabilityVerdict(probability)}</p>

            <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
              <span
                className="block h-full rounded-full bg-lime transition-[width] duration-500 ease-out"
                style={{ width: `${probability * 100}%` }}
              />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6">
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

            <p className="mt-6 text-[12px] leading-relaxed text-faint">
              Illustrative. The evidence below describes kinds of source, not real
              articles — a real forecast cites real ones.
            </p>
          </div>

          {/* The evidence */}
          <div>
            <p className="eyebrow">Evidence</p>
            <ul className="mt-5">
              {EVIDENCE.map((item) => {
                const on = active.includes(item.id);
                const supportsYes = item.supports === "yes";
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-pressed={on}
                      className={cn(
                        "group flex w-full items-start gap-4 border-t border-line py-5 text-left transition-opacity duration-300",
                        on ? "opacity-100" : "opacity-45 hover:opacity-75",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                          on && supportsYes && "border-yes/40 bg-yes/10 text-yes",
                          on && !supportsYes && "border-no/40 bg-no/10 text-no",
                          !on && "border-line text-faint",
                        )}
                      >
                        {supportsYes ? (
                          <Plus className="size-3.5" aria-hidden />
                        ) : (
                          <Minus className="size-3.5" aria-hidden />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] leading-snug text-fg">
                          {item.label}
                        </span>
                        <span className="mt-1.5 block text-[12.5px] text-faint">
                          {item.detail}
                        </span>
                      </span>

                      <span className="shrink-0 pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
                        {on ? "Counted" : "Ignored"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-line pt-5 text-[12.5px] leading-relaxed text-faint">
              Weight is <span className="text-muted">strength × reliability × relevance ×
              recency</span>, aggregated in log-odds against the base rate. Weak
              or stale sources move the number very little — that is the point.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Tracks `prefers-reduced-motion` without a render-time branch that could
 * differ between server and client: the server snapshot is always `false`.
 */
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

/**
 * Eases a displayed value toward its target so the probability counts rather
 * than jumping. Inert when the viewer prefers reduced motion.
 */
function useTween(target: number, disabled: boolean, duration = 480): number {
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
