import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { SectionEyebrow } from "./SectionEyebrow";
import { Reveal } from "../Reveal";
import { ProbabilityMeter } from "../product/ProbabilityMeter";
import { SourceOrb } from "../product/SourceOrb";
import { StanceChip } from "../product/StanceChip";
import { DEMO_APPLE } from "@/lib/demo";
import { formatPercent } from "@/lib/utils";

/**
 * Four large cards, each a state of the real interface.
 *
 * Deliberately not four icons in circles with a sentence each. The visual
 * occupies the top half of every card and is built from the same components the
 * product renders, so the section reads as four screenshots of one machine
 * rather than as an illustrated summary of it.
 */
const STEPS: { id: string; title: string; body: string; visual: ReactNode }[] = [
  {
    id: "ask",
    title: "Ask a question about the future.",
    body: "Predictly restates it as an event that can actually be settled and names the outcomes, so there is no argument later about what counts as it happening.",
    visual: (
      <div className="rounded-[var(--radius-md)] border border-border-strong bg-white p-5 shadow-[var(--shadow-object)]">
        <div className="flex items-start gap-3">
          <Search className="mt-0.5 size-[18px] shrink-0 text-cobalt" aria-hidden />
          <p className="text-[16px] leading-snug text-ink">{DEMO_APPLE.question}</p>
        </div>
        <div className="mt-5 flex items-center justify-between">
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
    title: "Predictly reads the open web.",
    body: "It searches, follows what it finds and reads the article text rather than a snippet. The same story under three URLs collapses into one source.",
    visual: (
      <ul className="flex flex-wrap items-start justify-center gap-5 sm:gap-7">
        {DEMO_APPLE.sources.map((source) => (
          <li key={source.id}>
            <SourceOrb brand={source.brand} size="md" label={source.name} />
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "evaluate",
    title: "Every source is weighed on its own.",
    body: "Which outcome it points to and how strongly, how reliable the publisher is, how relevant it is to your exact question, and how recently it was written.",
    visual: (
      <ul className="space-y-2.5">
        {DEMO_APPLE.sources.slice(0, 3).map((source) => (
          <li
            key={source.id}
            className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border bg-white px-4 py-3"
          >
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">
              {source.name}
            </span>
            <StanceChip stance={source.stance} />
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "forecast",
    title: "The evidence becomes a probability.",
    body: "Weights are aggregated in log-odds with ordinary arithmetic. Same evidence in, same number out — no model is ever asked what the answer is.",
    visual: (
      <div className="text-center">
        <p className="text-[3.5rem] font-semibold leading-[0.85] tracking-[-0.05em] tabular-nums text-cobalt sm:text-[4rem]">
          {formatPercent(DEMO_APPLE.probability)}
        </p>
        <p className="mt-3 text-[15px] font-semibold uppercase tracking-[0.14em] text-ink">Likely</p>
        <ProbabilityMeter probability={DEMO_APPLE.probability} size="md" className="mt-6" />
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y scroll-mt-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>How it works</SectionEyebrow>
          <h2 className="mt-6 text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.04em]">
            What happens when you make a prediction.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-muted">
            Four steps, and a language model is only trusted with two of them.
          </p>
        </div>

        <ol className="mx-auto mt-14 grid max-w-2xl gap-5 sm:mt-20 lg:max-w-none lg:grid-cols-2 lg:gap-6">
          {STEPS.map((step, index) => (
            <li key={step.id}>
              <Reveal delay={index * 0.05}>
                <article className="surface flex h-full flex-col px-6 pb-8 pt-8 sm:px-9 sm:pb-10 sm:pt-10">
                  {/* The visual owns the top of the card and is vertically
                      centred in it, so all four read as one strip however
                      differently sized their contents are. */}
                  <div className="flex min-h-[15rem] items-center sm:min-h-[16rem]">
                    <div className="w-full">{step.visual}</div>
                  </div>

                  <p className="mt-10 flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em]">
                    <span className="text-cobalt">{String(index + 1).padStart(2, "0")}</span>
                    <span className="size-1 rounded-full bg-border-strong" aria-hidden />
                    <span className="text-muted">{step.id}</span>
                  </p>

                  <h3 className="mt-4 text-[21px] font-semibold leading-[1.18] tracking-[-0.03em] sm:text-[24px]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted">{step.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
