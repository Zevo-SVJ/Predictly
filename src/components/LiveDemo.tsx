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
    <section id="how-it-works" className="scroll-mt-20 section-y border-b border-line">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="font-semibold leading-[0.92]" style={{ fontSize: "var(--text-h2)" }}>
            Ask. We&apos;ll investigate.
          </h2>
          <p className="max-w-[38ch] text-[14.5px] leading-relaxed text-muted">
            This runs the real thing, right here. Pick a question and watch
            Predictly research it — no account, no simulation.
          </p>
        </div>

        {running === null ? (
          <div className="mt-12 sm:mt-16">
            <p className="eyebrow">Choose a question</p>
            <ul className="mt-5">
              {questions.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => setRunning(event.question)}
                    className="group flex w-full items-center gap-5 border-t border-line py-6 text-left transition-[padding] duration-300 hover:pl-2"
                  >
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-lime/70">
                      {event.topic}
                    </span>
                    <span
                      className="min-w-0 flex-1 font-medium leading-snug transition-colors duration-300 group-hover:text-lime"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {event.question}
                    </span>
                    <span
                      className={cn(
                        "hidden shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 py-2",
                        "text-[13px] font-medium transition-colors duration-300",
                        "group-hover:border-lime/40 group-hover:bg-lime/[0.06] group-hover:text-lime sm:inline-flex",
                      )}
                    >
                      Investigate
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-line" />
          </div>
        ) : (
          <div className="mt-12 sm:mt-16">
            <button
              type="button"
              onClick={() => setRunning(null)}
              className="eyebrow mb-8 transition-colors hover:text-fg"
            >
              ← Choose another question
            </button>
            {/* Keyed so picking a different question starts a clean run. */}
            <PredictFlow key={running} initialQuestion={running} />
          </div>
        )}
      </div>
    </section>
  );
}
