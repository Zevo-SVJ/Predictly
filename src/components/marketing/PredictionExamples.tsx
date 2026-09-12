"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { LogoOrb } from "./BrandLogo";
import { SectionHeader } from "./SectionHeader";
import { useAskPredictly } from "../PredictionStage";
import { Reveal } from "../Reveal";
import { DEMO_EXAMPLES } from "@/lib/demo";
import { formatPercent } from "@/lib/utils";

/**
 * Six questions and six answers.
 *
 * This is where a testimonial wall would sit on most pages. Predictly has no
 * users yet, so it has no testimonials, and inventing three enthusiastic
 * strangers is not worth what it costs — what goes here instead is the product
 * doing its job across six domains.
 *
 * Pressing a card hands its question to the stage at the top of the page rather
 * than navigating, so the page becomes the forecast in place.
 */
export function PredictionExamples() {
  const ask = useAskPredictly();
  const router = useRouter();

  const open = (question: string) => {
    if (ask) ask(question);
    else router.push(`/predict?q=${encodeURIComponent(question)}`);
  };

  return (
    <section id="examples" className="section-y scroll-mt-28">
      <div className="container-page">
        <SectionHeader eyebrow="Examples" title="Questions worth predicting.">
          Sport, technology, markets, science — Predictly has no fixed list of
          topics. It works out the domain from the question and goes looking.
        </SectionHeader>

        <ul className="mx-auto mt-14 grid max-w-xl gap-4 sm:mt-20 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_EXAMPLES.map((item, index) => (
            <li key={item.id} className="h-full">
              <Reveal delay={(index % 3) * 0.05} className="h-full">
                <button
                  type="button"
                  onClick={() => open(item.question)}
                  className="surface group flex h-full w-full flex-col justify-between gap-8 px-6 py-7 text-left transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
                >
                  <span>
                    <span className="flex items-center justify-between gap-3">
                      <LogoOrb brand={item.brand} size="md" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {item.category}
                      </span>
                    </span>
                    <span className="mt-5 block text-[17px] font-medium leading-snug tracking-[-0.015em] text-ink">
                      {item.question}
                    </span>
                  </span>

                  <span>
                    <span className="flex items-baseline gap-2.5">
                      <span className="text-[30px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-cobalt">
                        {formatPercent(item.probability)}
                      </span>
                      <span className="min-w-0 truncate text-[14px] text-muted">
                        {item.outcomeLabel}
                      </span>
                    </span>
                    <span className="mt-3 block text-[12.5px] text-muted">
                      Confidence{" "}
                      <span className="font-semibold capitalize text-ink">{item.confidence}</span>
                    </span>
                    <span className="mt-4 flex items-center gap-1.5 text-[13px] text-muted transition-colors group-hover:text-cobalt">
                      Forecast this
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-[12.5px] text-muted">
          Example forecasts. Percentages come from Predictly&rsquo;s probability
          engine using illustrative evidence weights, not from live research.
        </p>
      </div>
    </section>
  );
}
