import { Check } from "lucide-react";
import { Reveal } from "../Reveal";
import { ConfidenceIndicator } from "../product/ConfidenceIndicator";
import { ExampleBadge } from "../product/ExampleBadge";
import { ProbabilityMeter } from "../product/ProbabilityMeter";
import { DEMO_APPLE } from "@/lib/demo";
import { formatPercent, probabilityVerdict } from "@/lib/utils";

/**
 * Probability and confidence are not the same number.
 *
 * This is the distinction most forecasting products quietly skip, and skipping
 * it is what lets a percentage built on two stale blog posts look exactly like
 * one built on five independent primary sources.
 *
 * The four factors listed are not marketing copy: they are the four terms
 * `scoreConfidence` actually reads — how many sources were usable, how reliable
 * they were, how recent, and how much they agreed. Nothing else feeds it.
 */
const FACTORS = [
  {
    label: "Enough sources",
    body: "How many usable sources the research returned. Two is not a basis for a confident call, however good they are.",
  },
  {
    label: "Source quality",
    body: "How much weight the publishers carry. A primary statement counts for more than an aggregator repeating it.",
  },
  {
    label: "Recency",
    body: "How recently the evidence was written. A forecast resting entirely on old material cannot be high-confidence, however unanimous.",
  },
  {
    label: "Agreement",
    body: "How concentrated the evidence is on one outcome. Sources pulling in opposite directions lower confidence without moving the probability.",
  },
];

export function Confidence() {
  return (
    <section className="section-y bg-canvas">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">Probability vs confidence</p>
          <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
            Every forecast comes with two numbers.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            One says how likely the event is. The other says how much to trust
            the first. A coin flip can be a high-confidence forecast, and an 80%
            call can be a shaky one — collapsing them into a single figure hides
            exactly the thing you need to know.
          </p>
        </div>

        <Reveal className="mt-10 sm:mt-14">
          <div className="grid overflow-hidden rounded-[var(--radius-xl)] border border-border bg-white lg:grid-cols-2">
            {/* --- the event ------------------------------------------- */}
            <div className="min-w-0 border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">Probability</p>
                <ExampleBadge />
              </div>
              <p className="mt-4 text-[15px] leading-snug text-muted">{DEMO_APPLE.question}</p>

              <p className="mt-6 text-[4rem] font-semibold leading-[0.85] tracking-[-0.045em] tabular-nums text-cobalt sm:text-[5rem]">
                {formatPercent(DEMO_APPLE.probability)}
              </p>
              <p className="mt-3 text-[17px] font-medium text-ink">
                {probabilityVerdict(DEMO_APPLE.probability)}
              </p>

              <ProbabilityMeter probability={DEMO_APPLE.probability} size="lg" className="mt-6" />

              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                How likely the event itself is, given everything Predictly read.
              </p>
            </div>

            {/* --- the forecast ---------------------------------------- */}
            <div className="min-w-0 bg-raised p-6 sm:p-8">
              <p className="eyebrow">Confidence</p>
              <ConfidenceIndicator confidence={DEMO_APPLE.confidence} className="mt-4" />

              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                How much to trust the number on the left. Four things decide it,
                and nothing else does.
              </p>

              <ul className="mt-6 space-y-4">
                {FACTORS.map((factor) => (
                  <li key={factor.label} className="flex gap-3">
                    <span
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cobalt-soft text-cobalt"
                      aria-hidden
                    >
                      <Check className="size-3" strokeWidth={2.6} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium text-ink">{factor.label}</span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                        {factor.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
