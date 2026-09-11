"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HeroUnderline } from "./HeroUnderline";
import { PredictionInput } from "../product/PredictionInput";

/**
 * One centred column and a great deal of air.
 *
 * Five seconds to the product: what it is, what it does, how to start, and what
 * it runs on. The three feature cards beneath it carry the proof, so nothing
 * else competes for that first screen.
 *
 * The primary action is a real link to `/predict` that scripting upgrades into
 * the composer, opened in place and focused. Without JavaScript it navigates to
 * the same flow on its own route, so the page's main action is never dead.
 */
export function Hero({ onSubmit }: { onSubmit: (question: string) => void }) {
  const [asking, setAsking] = useState(false);

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">Predictly</p>

      <h1 className="mt-7 text-[length:var(--text-hero)] font-semibold leading-[1.0] tracking-[-0.045em]">
        Predict what <HeroUnderline>happens next.</HeroUnderline>
      </h1>

      <p className="mx-auto mt-8 max-w-lg text-[17px] leading-relaxed text-muted sm:text-[19px]">
        Ask about any real-world event that hasn&rsquo;t happened yet. Predictly
        researches the evidence and turns it into a probability.
      </p>

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
  );
}
