import { Reveal } from "../Reveal";
import { CategoryBadge } from "../product/CategoryBadge";
import { ExampleBadge } from "../product/ExampleBadge";
import { ProbabilityMeter } from "../product/ProbabilityMeter";
import { SourceLogo } from "../product/SourceLogo";
import { DEMO_EXAMPLES } from "@/lib/demo";
import { formatPercent } from "@/lib/utils";

/**
 * The range of the product, shown rather than listed.
 *
 * Six domains, each represented by an actual answer — a mark, a question, a
 * probability and the reading behind it — instead of a category name and an
 * icon. The point of the section is "there is no end to what you can ask", and
 * a grid of nouns does not make that case; six real results do.
 *
 * Every percentage comes out of the probability engine, and the stamp says
 * these are examples. Politics, culture and the rest work the same way; they
 * are left out because eight tiles is a catalogue and six is a demonstration.
 */
export function Examples() {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">What you can ask</p>
          <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
            If it hasn&rsquo;t happened yet, it&rsquo;s a question.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            Sport, technology, markets, culture, politics, science — Predictly
            has no fixed list of topics. It works out the domain from the
            question and goes looking.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {DEMO_EXAMPLES.map((item, index) => (
            <li key={item.id} className="min-w-0">
              <Reveal delay={index * 0.05} className="h-full">
                <article className="flex h-full flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-border bg-white p-5 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-border bg-canvas text-ink">
                        <SourceLogo brand={item.brand} size={17} />
                      </span>
                      <CategoryBadge category={item.category} />
                    </div>

                    <h3 className="mt-4 text-[16px] font-medium leading-snug text-ink">
                      {item.question}
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-cobalt">
                        {formatPercent(item.probability)}
                      </span>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                        {item.sourceCount} sources
                      </span>
                    </div>
                    <ProbabilityMeter probability={item.probability} size="sm" className="mt-3" />
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ExampleBadge />
          <p className="text-[12.5px] text-muted">
            Percentages produced by Predictly&rsquo;s probability engine from
            illustrative evidence weights, not from live research.
          </p>
        </div>
      </div>
    </section>
  );
}
