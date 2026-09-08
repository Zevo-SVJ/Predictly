"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { PredictFlow } from "./PredictFlow";
import type { TrendingEvent } from "@/lib/trending";
import { cn } from "@/lib/utils";

/**
 * The product, embedded in the page.
 *
 * Picking a question runs the real `POST /api/predict` — the same pipeline,
 * the same research, the same persistence as `/predict`. Nothing here is
 * simulated: if the deployment has no research credentials the visitor sees the
 * configuration state, because a convincing fake would defeat the purpose of
 * putting the product on the page at all.
 */
export function LiveDemo({ questions }: { questions: TrendingEvent[] }) {
  const [running, setRunning] = useState<string | null>(null);

  return (
    <section id="ask" className="scroll-mt-20 border-t border-line py-16 sm:py-24">
      <div className="container-content">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2
            className="font-semibold leading-[0.9] tracking-[-0.045em]"
            style={{ fontSize: "var(--text-h1)" }}
          >
            Ask Predictly
          </h2>
          <p className="max-w-[34ch] text-[15px] leading-relaxed text-muted">
            Give it a future question. We&apos;ll investigate — right here, no
            account, no simulation.
          </p>
        </div>

        {running === null ? (
          <ul className="mt-12 sm:mt-16">
            {questions.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => setRunning(event.question)}
                  className="group flex w-full flex-col gap-6 border-t border-line py-10 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-10"
                >
                  <span className="min-w-0">
                    <span className="eyebrow block">{event.topic}</span>
                    <span
                      className="mt-3 block font-semibold leading-[1.05] tracking-[-0.035em] transition-colors duration-300 group-hover:text-lime"
                      style={{ fontSize: "var(--text-h2)" }}
                    >
                      {event.question}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2.5 rounded-full bg-lime px-6 py-3.5",
                      "text-[15px] font-medium text-lime-ink transition-all duration-200",
                      "group-hover:bg-lime-dim group-active:scale-[0.97]",
                    )}
                  >
                    Investigate
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </button>
              </li>
            ))}
            <li className="border-t border-line" aria-hidden />
          </ul>
        ) : (
          <div className="mt-12 sm:mt-16">
            <button
              type="button"
              onClick={() => setRunning(null)}
              className="eyebrow mb-8 transition-colors hover:text-fg"
            >
              ← Ask something else
            </button>
            {/* Keyed so picking a different question starts a clean run. */}
            <PredictFlow key={running} initialQuestion={running} />
          </div>
        )}
      </div>
    </section>
  );
}
