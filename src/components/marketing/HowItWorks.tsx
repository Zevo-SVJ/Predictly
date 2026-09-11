import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { LogoOrb } from "./BrandLogo";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "../Reveal";
import { DEMO_APPLE } from "@/lib/demo";
import { formatPercent } from "@/lib/utils";

/**
 * Three states of the real interface, in the order the pipeline runs.
 *
 * Deliberately not three icons in circles with a sentence each: the visual owns
 * the top of every card and is built from the same pieces the product renders,
 * so the section reads as three screenshots of one machine rather than an
 * illustrated summary of it.
 */
const STEPS: { id: string; step: string; title: string; body: string; visual: ReactNode }[] = [
  {
    id: "ask",
    step: "Ask",
    title: "Ask a question about the future.",
    body: "Predictly restates it as an event that can actually be settled, so there is no argument later about what counted as it happening.",
    visual: (
      <div className="rounded-[var(--radius-md)] border border-border-strong bg-white p-5 shadow-[var(--shadow-object)]">
        <div className="flex items-start gap-3">
          <Search className="mt-0.5 size-[18px] shrink-0 text-cobalt" aria-hidden />
          <p className="text-[16px] leading-snug text-ink">{DEMO_APPLE.question}</p>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="label">2 outcomes</span>
          <span className="rounded-full bg-cobalt px-4 py-2 text-[13px] font-semibold text-white">
            Predict
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "research",
    step: "Research",
    title: "Predictly reads the open web.",
    body: "It searches, follows what it finds and reads the article text rather than a snippet. The same story under three URLs collapses into one source.",
    visual: (
      <ul className="flex flex-wrap items-start justify-center gap-4 sm:gap-5">
        {DEMO_APPLE.sources.map((source, index) => (
          <li key={source.id}>
            <LogoOrb brand={source.brand} size="md" label={source.name} delayMs={index * 70} />
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "forecast",
    step: "Forecast",
    title: "The evidence becomes a probability.",
    body: "Weights are aggregated with ordinary arithmetic. Same evidence in, same number out — no model is ever asked what the answer is.",
    visual: (
      <div className="text-center">
        <p className="text-[3.75rem] font-semibold leading-[0.82] tracking-[-0.05em] tabular-nums text-cobalt">
          {formatPercent(DEMO_APPLE.probability)}
        </p>
        <span className="mt-4 inline-block rounded-full bg-cobalt-soft px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-cobalt">
          Likely
        </span>
        <ul className="mt-8 space-y-3 text-left">
          {[
            { label: "Yes", value: DEMO_APPLE.probability, lead: true },
            { label: "No", value: 1 - DEMO_APPLE.probability, lead: false },
          ].map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4">
              <span className={row.lead ? "text-[15px] font-semibold text-ink" : "text-[15px] text-muted"}>
                {row.label}
              </span>
              <span
                className={
                  row.lead
                    ? "text-[15px] font-semibold tabular-nums text-cobalt"
                    : "text-[15px] tabular-nums text-muted"
                }
              >
                {formatPercent(row.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y scroll-mt-28 bg-canvas">
      <div className="container-page">
        <SectionHeader eyebrow="How it works" title="What happens when you make a prediction.">
          Predictly researches the question, weighs the evidence, and turns it
          into a probability.
        </SectionHeader>

        <ol className="mx-auto mt-14 grid max-w-xl gap-5 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-6">
          {STEPS.map((step, index) => (
            <li key={step.id} className="h-full">
              <Reveal delay={index * 0.06} className="h-full">
                <article className="surface flex h-full flex-col px-6 pb-9 pt-9 sm:px-8 sm:pb-10 sm:pt-10">
                  <div className="flex min-h-[17rem] items-center justify-center">
                    <div className="w-full">{step.visual}</div>
                  </div>

                  <p className="mt-9 flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em]">
                    <span className="text-cobalt">{String(index + 1).padStart(2, "0")}</span>
                    <span className="size-1 rounded-full bg-border-strong" aria-hidden />
                    <span className="text-muted">{step.step}</span>
                  </p>

                  <h3 className="mt-4 text-[20px] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[22px]">
                    {step.title}
                  </h3>
                  <p className="mt-3.5 text-[15px] leading-relaxed text-muted">{step.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
