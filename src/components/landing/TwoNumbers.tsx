import { Check } from "lucide-react";
import { SectionEyebrow } from "./SectionEyebrow";
import { Reveal } from "../Reveal";
import { ConfidenceIndicator } from "../product/ConfidenceIndicator";
import { ProbabilityMeter } from "../product/ProbabilityMeter";
import { DEMO_APPLE } from "@/lib/demo";
import { formatPercent, probabilityVerdict } from "@/lib/utils";

/**
 * Probability and confidence are not the same number.
 *
 * This is the distinction most forecasting products quietly skip, and skipping
 * it is what lets a percentage built on two stale posts look exactly like one
 * built on five recent primary sources.
 *
 * The four factors are not marketing copy — they are the four terms
 * `scoreConfidence` actually reads: how many sources were usable, how reliable
 * they were, how recent, and how much they agreed. They are stated
 * qualitatively because a count here would be a number about a demonstration,
 * and those get quoted back as if they were measurements.
 */
const FACTORS = [
  "Enough usable sources to stand behind a call",
  "Publishers that carry weight, not aggregators repeating each other",
  "Evidence recent enough that the world hasn't moved",
  "Sources that broadly agree rather than pulling apart",
];

export function TwoNumbers() {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>The two numbers</SectionEyebrow>
          <h2 className="mt-6 text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.04em]">
            How likely, and how sure.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-muted">
            One number is about the event. The other is about the forecast. A
            coin flip can be a confident call, and an 80% call can be a shaky
            one — collapsing them hides the thing you actually need.
          </p>
        </div>

        <Reveal className="mx-auto mt-14 grid max-w-2xl gap-5 sm:mt-20 lg:max-w-none lg:grid-cols-2 lg:gap-6">
          <div className="surface min-w-0 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="label">Probability</p>
            <p className="mt-8 text-[4.5rem] font-semibold leading-[0.82] tracking-[-0.055em] tabular-nums text-cobalt sm:text-[5.5rem]">
              {formatPercent(DEMO_APPLE.probability)}
            </p>
            <p className="mt-5 text-[18px] font-semibold tracking-[-0.02em] text-ink">
              {probabilityVerdict(DEMO_APPLE.probability)}
            </p>
            <ProbabilityMeter
              probability={DEMO_APPLE.probability}
              size="lg"
              className="mx-auto mt-9 max-w-xs"
            />
            <p className="mx-auto mt-8 max-w-xs text-[14px] leading-relaxed text-muted">
              How likely the event itself is, given everything Predictly read.
            </p>
          </div>

          <div className="surface min-w-0 px-6 py-10 sm:px-10 sm:py-12">
            <p className="label">Confidence</p>
            <div className="mt-8 flex justify-center">
              <ConfidenceIndicator confidence={DEMO_APPLE.confidence} />
            </div>
            <p className="mx-auto mt-8 max-w-xs text-center text-[14px] leading-relaxed text-muted">
              How much to trust the number beside it. Four things decide it, and
              nothing else does.
            </p>

            <ul className="mt-9 space-y-4 border-t border-border pt-8">
              {FACTORS.map((factor) => (
                <li key={factor} className="flex gap-3">
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cobalt-soft text-cobalt"
                    aria-hidden
                  >
                    <Check className="size-3" strokeWidth={2.6} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
