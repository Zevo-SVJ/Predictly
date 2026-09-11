"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "../Logo";
import { PredictionInput } from "../product/PredictionInput";
import { useAskPredictly } from "../PredictionStage";

/**
 * The page ends on the action it opened with, and on nothing else.
 *
 * No feature section after this, no second footer of links dressed as content —
 * the mark, one line, the action, and a note that says plainly what a forecast
 * is not. The composer opens in place exactly as it does in the hero, and
 * submitting hands the question to the stage at the top of the page.
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
          <span className="mx-auto flex size-14 items-center justify-center rounded-[var(--radius-md)] border border-border bg-white shadow-[var(--shadow-object)]">
            <Logo className="size-7" />
          </span>

          <p className="eyebrow mt-8">Get started</p>

          <h2 className="mt-6 text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.04em]">
            Know what&rsquo;s likely before it happens.
          </h2>

          <p className="mx-auto mt-6 max-w-md text-[17px] leading-relaxed text-muted">
            Ask a question. Let Predictly research the evidence. Get a
            probability.
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

          <p className="mt-8 text-[13px] text-muted">
            Research-backed forecasts. No certainty claims.
          </p>
        </div>
      </div>
    </section>
  );
}
