"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HeroUnderline } from "./HeroUnderline";
import { SectionEyebrow } from "./SectionEyebrow";
import { ForecastShowcase } from "../product/ForecastShowcase";
import { PredictionInput } from "../product/PredictionInput";
import { DEMO_RACE } from "@/lib/demo";

/**
 * One column, centred, and a great deal of air.
 *
 * The order answers the product in about five seconds: what it is, what it
 * does, how to start, what it runs on — and then, one short scroll down, what
 * it actually gives you. Nothing else is in the first scene, because anything
 * else would be competing with the headline for the same five seconds.
 *
 * The primary action opens the composer in place rather than scrolling to it or
 * routing away: someone who has decided to ask should be typing on the next
 * frame.
 */
export function Hero({ onSubmit }: { onSubmit: (question: string) => void }) {
  const [asking, setAsking] = useState(false);

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <SectionEyebrow>AI forecasting</SectionEyebrow>

        <h1 className="mt-7 text-[length:var(--text-hero)] font-semibold leading-[1.0] tracking-[-0.045em]">
          Know what&rsquo;s likely to{" "}
          <HeroUnderline>happen next.</HeroUnderline>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-muted sm:text-[19px]">
          Predictly researches the latest evidence, weighs what matters, and
          gives you a probability for what happens next.
        </p>

        {/* The action slot. Same position either way, so opening the composer
            does not move the object below it. */}
        <div id="ask" className="mx-auto mt-10 max-w-xl scroll-mt-32">
          {asking ? (
            <div className="animate-rise-in">
              <PredictionInput onSubmit={onSubmit} autoFocus />
              <button
                type="button"
                onClick={() => setAsking(false)}
                className="mt-4 text-[14px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Back
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              {/* A real link first. With JavaScript it opens the composer in
                  place; without it, /predict is the same flow on its own
                  route — so the page's primary action is never dead. */}
              <Link
                href="/predict"
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                  event.preventDefault();
                  setAsking(true);
                }}
                className="pill-primary"
              >
                Make a prediction
                <ArrowRight className="size-[18px]" aria-hidden />
              </Link>
              <Link href="/#how-it-works" className="pill-secondary">
                See how it works
              </Link>
            </div>
          )}
        </div>

        {/* The mechanism, not a metric. Nothing here is a number we would have
            had to measure. */}
        <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted sm:text-[12.5px] sm:tracking-[0.18em]">
          Web research · Evidence · Probability
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-xl sm:mt-24 lg:max-w-2xl">
        <ForecastShowcase forecast={DEMO_RACE} />
      </div>
    </div>
  );
}
