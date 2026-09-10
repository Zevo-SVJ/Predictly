"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAskPredictly } from "../PredictionStage";
import { SourceLogo } from "../product/SourceLogo";
import { DEMO_QUESTIONS } from "@/lib/demo";

/**
 * Questions, moving.
 *
 * The heading says "popular" and nothing more precise, because we have no
 * traffic data and a counter beside each one would be an invented statistic.
 * What is true of every item is that it is a real event nobody knows the answer
 * to yet — which is the only claim the section needs to make.
 *
 * The track is duplicated and translated by half its width, so the loop is
 * seamless with no measurement in JavaScript. It pauses on hover and on focus,
 * and stops entirely under reduced motion, where it becomes a plain scroller.
 */
export function TrendingRail() {
  const ask = useAskPredictly();
  const router = useRouter();

  const open = (question: string) => {
    if (ask) ask(question);
    else router.push(`/predict?q=${encodeURIComponent(question)}`);
  };

  return (
    <section id="trending" className="scroll-mt-24 border-y border-border bg-canvas py-10 sm:py-14">
      <p className="container-page eyebrow">People are asking</p>

      <div className="rail-mask mt-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul
          className="animate-rail rail-track flex w-max gap-3 px-5 sm:px-10"
          style={{ "--rail-duration": "72s" } as React.CSSProperties}
        >
          {/* Duplicated for the seamless loop; the copy is hidden from the
              accessibility tree so nothing is announced twice, and removed
              entirely on touch, where the rail does not animate. */}
          {[...DEMO_QUESTIONS, ...DEMO_QUESTIONS].map((entry, index) => (
            <li
              key={`${entry.question}-${index}`}
              aria-hidden={index >= DEMO_QUESTIONS.length}
              className={index >= DEMO_QUESTIONS.length ? "rail-dup" : undefined}
            >
              <button
                type="button"
                tabIndex={index >= DEMO_QUESTIONS.length ? -1 : undefined}
                onClick={() => open(entry.question)}
                className="group flex min-h-12 items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-white py-2.5 pl-3.5 pr-4 text-[14px] text-ink shadow-[var(--shadow-card)] transition-colors hover:border-cobalt-line hover:bg-cobalt-soft"
              >
                {entry.brand ? (
                  <SourceLogo brand={entry.brand} size={14} className="text-muted" />
                ) : null}
                {entry.question}
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-muted transition-colors group-hover:text-cobalt"
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
