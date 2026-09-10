"use client";

import { ForecastCard } from "../product/ForecastCard";
import { PredictionInput } from "../product/PredictionInput";
import { SuggestionChips } from "../product/SuggestionChips";
import { DEMO_RACE, DEMO_SUGGESTIONS } from "@/lib/demo";
import { FREE_MODE } from "@/lib/config";

/**
 * The hero shows the product rather than describing it.
 *
 * Three objects and nothing else: the sentence that says what Predictly does,
 * the control that does it, and a real forecast card built from the same
 * components a live answer renders through. The transformation the page is
 * selling — question above, forecast below — is the composition itself.
 *
 * On a phone that reads top to bottom in one column, with the card immediately
 * under the chips so the first scroll lands on a product surface rather than on
 * a marketing paragraph. Above 1024px it splits, and the card drops half a step
 * so the two halves are related rather than mirrored.
 */
export function Hero({ onSubmit }: { onSubmit: (question: string) => void }) {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
      <div className="min-w-0 lg:pt-6">
        <p className="eyebrow">Question → research → evidence → forecast</p>

        <h1 className="mt-4 text-[length:var(--text-hero)] font-semibold leading-[1.02] tracking-[-0.04em]">
          Predict what
          <br />
          happens next.
        </h1>

        <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted sm:text-[17px]">
          Ask about any real-world event that hasn&rsquo;t happened yet.
          Predictly researches the latest evidence, weighs every source it
          finds, and turns it into a probability.
        </p>

        <div id="ask" className="mt-7 scroll-mt-28">
          <PredictionInput onSubmit={onSubmit} />
        </div>

        <SuggestionChips questions={DEMO_SUGGESTIONS} onSelect={onSubmit} className="mt-4" />

        {/* Two facts, both true of the code above it rather than of a roadmap:
            forecasts run for anonymous visitors, and `FREE_MODE` gates the
            entire billing story. Nothing here is a metric or a claim. */}
        <p className="mt-6 text-[13px] text-faint">
          No account needed{FREE_MODE ? " · Free while Predictly is in launch" : ""}
        </p>
      </div>

      <div className="min-w-0 lg:pt-16">
        <ForecastCard forecast={DEMO_RACE} />
      </div>
    </div>
  );
}
