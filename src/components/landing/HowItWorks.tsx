import { Reveal } from "../Reveal";
import { EvidenceItem } from "../product/EvidenceItem";
import { ProbabilityBar } from "../product/ProbabilityBar";
import { ProbabilityValue } from "../product/ProbabilityValue";
import { ResearchProgress } from "../product/ResearchProgress";
import { SourceLogo } from "../product/SourceLogo";
import { DEMO_APPLE } from "@/lib/demo";
import { formatPercent } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Four states of one real interface, in the order the pipeline runs.
 *
 * Every panel below is built from the same components the product renders — no
 * illustrations, no icons in circles, no screenshots. The step numbers are the
 * only decoration, and they exist so the sequence is legible when the panels
 * stack into a single column on a phone.
 */
const STEPS: { id: string; title: string; body: string; panel: ReactNode }[] = [
  {
    id: "ask",
    title: "Ask",
    body: "One question about something that hasn't happened. Predictly restates it as an event that can actually be settled, and names the outcomes.",
    panel: (
      <div className="rounded-[var(--radius-md)] border border-border-strong bg-white p-3.5 shadow-[var(--shadow-card)]">
        <p className="text-[14px] leading-snug text-ink">{DEMO_APPLE.question}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            2 outcomes
          </span>
          <span className="rounded-[var(--radius-sm)] bg-cobalt px-2.5 py-1 text-[11px] font-medium text-white">
            Predict
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "research",
    title: "Research",
    body: "Predictly searches the open web and reads what it finds. The same story under three URLs collapses into one source.",
    panel: (
      <div className="rounded-[var(--radius-md)] border border-border bg-white p-3.5">
        <ResearchProgress stage="researching" detail="5 found" />
        <ul className="mt-2 flex flex-wrap gap-1.5 border-t border-border pt-3">
          {DEMO_APPLE.sources.map((source) => (
            <li
              key={source.id}
              className="flex items-center gap-1.5 rounded-full border border-border py-1 pl-2 pr-2.5"
            >
              <SourceLogo brand={source.brand} size={11} />
              <span className="text-[11px] text-muted">{source.name}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "weigh",
    title: "Weigh",
    body: "Each source is scored on its own — which outcome it points to, how strongly, how reliable the publisher is, and how recent it is.",
    panel: (
      <ul>
        {DEMO_APPLE.sources.slice(1, 2).map((source) => (
          <EvidenceItem key={source.id} source={source} />
        ))}
      </ul>
    ),
  },
  {
    id: "forecast",
    title: "Forecast",
    body: "The weights are aggregated in log-odds with ordinary arithmetic. Same evidence in, same number out — no model is asked for a percentage.",
    panel: (
      <div className="rounded-[var(--radius-md)] border border-border-strong bg-white p-4 shadow-[var(--shadow-card)]">
        <ProbabilityValue probability={DEMO_APPLE.probability} size="sm" />
        <p className="mt-1.5 text-[13px] font-medium text-ink">
          Yes <span className="font-normal text-muted">· foldable iPhone in 2027</span>
        </p>
        <ProbabilityBar probability={DEMO_APPLE.probability} leading className="mt-3" />
        <p className="mt-2 font-mono text-[10.5px] tabular-nums text-muted">
          NO {formatPercent(1 - DEMO_APPLE.probability)}
        </p>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y scroll-mt-24 bg-canvas">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
            What happens when you make a prediction.
          </h2>
        </div>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.id} className="min-w-0 bg-white">
              <Reveal delay={index * 0.06} className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[11px] tabular-nums text-cobalt">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{step.body}</p>

                {/* mt-auto pins every panel to the same baseline, so the four
                    read as one strip rather than four differently sized cards. */}
                <div className="mt-5 pt-1 lg:mt-auto">{step.panel}</div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
