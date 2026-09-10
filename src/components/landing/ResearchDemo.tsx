import { Reveal } from "../Reveal";
import { EvidenceItem } from "../product/EvidenceItem";
import { ExampleBadge, ExampleDisclosure } from "../product/ExampleBadge";
import { ResearchProgress } from "../product/ResearchProgress";
import { ResearchSource } from "../product/ResearchSource";
import { DEMO_APPLE } from "@/lib/demo";

/**
 * The section that answers the only objection that matters: isn't this just an
 * AI making up a number?
 *
 * It answers it by showing the machine mid-run — the question at the top, the
 * pipeline working through its stages, the sources arriving, and each one
 * broken into the scores the probability actually depends on. No feature grid,
 * no three columns of copy: one product surface, large, doing the work.
 */
export function ResearchDemo() {
  return (
    <section className="section-y bg-canvas">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">The research step</p>
          <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
            Every forecast starts with evidence.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            Predictly reads what it finds and scores each source on its own —
            how relevant it is to your exact question, and how much weight the
            publisher has earned. A language model does that reading. It is never
            asked what the answer is.
          </p>
        </div>

        <Reveal className="mt-10 sm:mt-14">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-card)]">
            {/* --- question + live stages --- */}
            <div className="border-b border-border p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <ExampleBadge />
              </div>
              <p className="mt-3 text-[19px] font-semibold leading-snug tracking-[-0.03em] sm:text-[24px]">
                {DEMO_APPLE.question}
              </p>
              <ResearchProgress stage="analyzing" detail="5 sources" className="mt-5 max-w-md" />
            </div>

            {/* --- sources found | evidence weighed --- */}
            <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="min-w-0 border-b border-border p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="eyebrow">Sources found</h3>
                  <span className="font-mono text-[11px] tabular-nums text-faint">
                    {String(DEMO_APPLE.sources.length).padStart(2, "0")}
                  </span>
                </div>
                <ul className="mt-1 divide-y divide-border">
                  {DEMO_APPLE.sources.map((source, index) => (
                    <ResearchSource key={source.id} source={source} index={index} />
                  ))}
                </ul>
              </div>

              <div className="min-w-0 bg-raised p-5 sm:p-7">
                <h3 className="eyebrow">Evidence, weighed</h3>
                <ul className="mt-3 space-y-3">
                  {DEMO_APPLE.sources.slice(0, 3).map((source, index) => (
                    <EvidenceItem key={source.id} source={source} index={index} />
                  ))}
                </ul>
                <p className="mt-3 text-[12.5px] text-faint">
                  Relevance × reliability × strength × recency gives each source
                  one weight. Those weights are what the probability is made of.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <ExampleDisclosure className="mt-4 max-w-2xl" />
      </div>
    </section>
  );
}
