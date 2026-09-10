"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ForecastCard } from "../product/ForecastCard";
import { PredictionInput } from "../product/PredictionInput";
import { DEMO_RACE } from "@/lib/demo";
import { cn } from "@/lib/utils";

/**
 * One vertical column, centred, and a real forecast underneath it.
 *
 * The order answers the product in about five seconds: what it is, what it
 * does, how to start, what it runs on, and then — without scrolling on a
 * desktop, one short scroll on a phone — what it actually gives you.
 *
 * The primary action opens the composer in place rather than scrolling to it or
 * routing away. A visitor who has decided to ask should be typing on the next
 * frame, not navigating.
 */
export function Hero({ onSubmit }: { onSubmit: (question: string) => void }) {
  const [asking, setAsking] = useState(false);

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-cobalt">AI forecasting</p>

        <h1 className="mt-5 text-[length:var(--text-hero)] font-semibold leading-[1.02] tracking-[-0.042em]">
          Know what&rsquo;s likely
          <br />
          to happen next.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-muted sm:text-[18px]">
          Predictly researches the latest evidence, weighs what matters, and
          gives you a probability for what happens next.
        </p>

        {/* The action slot. Same position either way, so opening the composer
            does not shift the card below it. */}
        <div id="ask" className="mx-auto mt-8 max-w-xl scroll-mt-28">
          {asking ? (
            <div className="animate-rise-in">
              <PredictionInput onSubmit={onSubmit} autoFocus />
              <button
                type="button"
                onClick={() => setAsking(false)}
                className="mt-3 text-[13.5px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Back
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setAsking(true)}
                className={cn(
                  "inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-cobalt px-7",
                  "text-[16px] font-medium text-white shadow-[var(--shadow-card)]",
                  "transition-all duration-200 hover:bg-cobalt-deep active:scale-[0.98]",
                )}
              >
                Make a prediction
                <ArrowRight className="size-[18px]" aria-hidden />
              </button>

              <Link
                href="/#how-it-works"
                className={cn(
                  "inline-flex min-h-13 items-center justify-center rounded-full border border-border bg-white px-7",
                  "text-[16px] font-medium text-ink transition-colors hover:bg-canvas",
                )}
              >
                See how it works
              </Link>
            </div>
          )}
        </div>

        {/* The mechanism, not a metric. Nothing here is a number we would have
            to have measured. */}
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          Web research · Evidence · Probability
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl sm:mt-16">
        <ForecastCard forecast={DEMO_RACE} />
      </div>
    </div>
  );
}
