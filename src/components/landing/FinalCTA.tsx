"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionEyebrow } from "./SectionEyebrow";
import { PredictionInput } from "../product/PredictionInput";
import { useAskPredictly } from "../PredictionStage";

/**
 * The page ends on the action it opened with, and on nothing else.
 *
 * No feature section after this, no second footer of links dressed as content.
 * The composer opens in place exactly as it does in the hero, and submitting
 * hands the question to the stage at the top of the page — which then becomes
 * the forecast, without a navigation.
 */
export function FinalCTA() {
  const ask = useAskPredictly();
  const router = useRouter();
  const [asking, setAsking] = useState(false);

  const submit = (question: string) => {
    if (ask) ask(question);
    else router.push(`/predict?q=${encodeURIComponent(question)}`);
  };

  return (
    <section className="section-y">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Make a prediction</SectionEyebrow>

          <h2 className="mt-6 text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.04em]">
            Ask what happens next.
          </h2>

          <p className="mx-auto mt-6 max-w-md text-[17px] leading-relaxed text-muted">
            One question, about a minute of research, and a number you can argue
            with — because you can see everything it was built from.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            {asking ? (
              <div className="animate-rise-in">
                <PredictionInput onSubmit={submit} autoFocus />
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
                  How it works
                </Link>
              </div>
            )}
          </div>

          <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted sm:text-[12.5px] sm:tracking-[0.18em]">
            No account needed · Free while Predictly is in launch
          </p>
        </div>
      </div>
    </section>
  );
}
