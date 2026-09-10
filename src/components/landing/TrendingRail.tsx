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
    <section id="trending" className="scroll-mt-28 border-y border-border bg-canvas py-12 sm:py-16">
      <p className="container-page label text-center">People are asking</p>

      <div className="rail-mask mt-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul
          className="animate-rail rail-track flex w-max gap-3 px-5 sm:gap-4 sm:px-10"
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
                className="group flex min-h-14 items-center gap-3 whitespace-nowrap rounded-full border border-border bg-white py-3 pl-3 pr-5 text-[15px] text-ink shadow-[var(--shadow-object)] transition-colors hover:border-cobalt-line hover:bg-cobalt-soft"
              >
                {entry.brand ? (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-canvas text-ink">
                    <SourceLogo brand={entry.brand} size={15} />
                  </span>
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
