import { Reveal } from "../Reveal";
import { ExampleBadge, ExampleDisclosure } from "../product/ExampleBadge";
import { ForecastSummary } from "../product/ForecastSummary";
import { SourceLogoTile } from "../product/SourceLogo";
import { StanceChip } from "../product/StanceChip";
import { DEMO_APPLE } from "@/lib/demo";

/**
 * The output of the section above it, and the page's typographic peak.
 *
 * Deliberately not a card. The section before this one is a large bordered
 * product surface and the one after is a stepped strip; putting a third
 * rounded rectangle here would flatten the whole middle of the page. The number
 * sits directly on white, at the largest size it is ever set, with the sources
 * it came from beside it — which is also the argument: this figure is a
 * conclusion, not a headline.
 */
export function ForecastExample() {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">See the forecast</p>
          <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
            Every prediction starts with evidence.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            This is the whole output: the question, the number, what it rests on,
            and how sure Predictly is about it. Nothing is hidden behind a
            summary.
          </p>
        </div>

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-20">
          <Reveal>
            <div className="min-w-0">
              <ExampleBadge />
              <h3 className="mt-4 text-[22px] font-semibold leading-[1.15] tracking-[-0.035em] sm:text-[30px]">
                {DEMO_APPLE.question}
              </h3>
              <ForecastSummary forecast={DEMO_APPLE} className="mt-8 sm:mt-10" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="min-w-0 lg:pt-4">
              <h3 className="eyebrow">What the number rests on</h3>

              <ul className="mt-4 divide-y divide-border border-y border-border">
                {DEMO_APPLE.sources.map((source) => (
                  <li key={source.id} className="flex items-center gap-3 py-3.5">
                    <SourceLogoTile brand={source.brand} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-ink">{source.name}</p>
                      <p className="mt-0.5 truncate text-[12px] text-muted">{source.kind}</p>
                    </div>
                    <StanceChip stance={source.stance} />
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[14.5px] leading-relaxed text-muted">
                Three of the five point the same way, one pushes back, and one
                is context. The gap between them — scaled by how much each
                source is worth — is the whole distance between a coin flip and
                the figure on the left.
              </p>

              <ExampleDisclosure className="mt-5" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
