"use client";

import { useRouter } from "next/navigation";
import { PredictionInput } from "../product/PredictionInput";
import { useAskPredictly } from "../PredictionStage";

/**
 * The page ends on the same action it opened with.
 *
 * A live input rather than a button to one: a visitor who has read this far has
 * a question in mind, and asking them to scroll back up to type it is a step
 * that only exists because the page was built top-down. Submitting here hands
 * the question straight to the stage at the top of the page, which then becomes
 * the forecast — no navigation.
 */
export function FinalCTA() {
  const ask = useAskPredictly();
  const router = useRouter();

  const submit = (question: string) => {
    if (ask) ask(question);
    else router.push(`/predict?q=${encodeURIComponent(question)}`);
  };

  return (
    <section className="section-y">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[length:var(--text-section)] font-semibold leading-[1.05]">
            Ask what happens next.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted sm:text-[17px]">
            One question, about a minute of research, and a number you can argue
            with — because you can see everything it was built from.
          </p>

          {/* The input itself, not a button that scrolls back to one. Asking
              is the product; a second CTA pointing at the first is furniture. */}
          <PredictionInput onSubmit={submit} className="mt-9" />
        </div>
      </div>
    </section>
  );
}
