import type { ReactNode } from "react";
import { EvidenceVisual } from "./EvidenceVisual";
import { PredictionVisual } from "./PredictionVisual";
import { SourceCluster } from "./SourceCluster";
import { Reveal } from "../Reveal";
import { DEMO_APPLE, DEMO_RACE } from "@/lib/demo";

/**
 * Three cards, three ideas, one each.
 *
 * This is the page's first product moment and replaces what used to be a single
 * forecast card — which showed the output but none of the work behind it, and
 * read as a dashboard widget. Each card here is mostly its visual: the object
 * makes the point and the text underneath only names it.
 */
const CARDS: { id: string; title: string; body: string; visual: ReactNode }[] = [
  {
    id: "research",
    title: "Research every angle",
    body: "Predictly searches the open web for your exact question and reads what it finds — official sources, reporting, and the places an answer actually surfaces first.",
    visual: (
      <SourceCluster
        question="Will Apple release a foldable iPhone in 2027?"
        above={["apple", "arstechnica", "techcrunch"]}
        below={["nyt", "cnn", "guardian"]}
      />
    ),
  },
  {
    id: "evidence",
    title: "Evidence moves the number",
    body: "Every source is scored on its own before any probability exists — how relevant it is, how much the publisher is worth, and which way it points.",
    visual: (
      <EvidenceVisual
        probability={DEMO_APPLE.probability}
        verdict="Likely"
        supporting={["apple", "arstechnica", "techcrunch"]}
        against={["nyt"]}
      />
    ),
  },
  {
    id: "forecast",
    title: "One question. One forecast.",
    body: "The weights become a probability with ordinary arithmetic — and every competing outcome is shown, so the headline figure is never mistaken for a certainty.",
    visual: (
      <PredictionVisual
        question="Who wins the next F1 race?"
        outcomes={DEMO_RACE.outcomes.map((outcome) => ({
          id: outcome.id,
          label: outcome.label,
          probability: outcome.probability,
          brand: DEMO_RACE.outcomeMeta.find((meta) => meta.id === outcome.id)?.brand,
        }))}
      />
    ),
  },
];

export function FeatureCards() {
  return (
    <section className="section-y">
      <div className="container-page">
        <ul className="mx-auto grid max-w-xl gap-5 lg:max-w-none lg:grid-cols-3 lg:gap-6">
          {CARDS.map((card, index) => (
            <li key={card.id} className="h-full">
              <Reveal delay={index * 0.06} className="h-full">
                <article className="surface flex h-full flex-col px-6 pb-9 pt-9 sm:px-8 sm:pb-10 sm:pt-10">
                  {/* The visual owns the top of the card and is centred in a
                      fixed band, so all three read as one row however
                      differently sized their contents are. */}
                  <div className="flex min-h-[17rem] items-center justify-center">
                    <div className="w-full">{card.visual}</div>
                  </div>

                  <h2 className="mt-9 text-[20px] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[22px]">
                    {card.title}
                  </h2>
                  <p className="mt-3.5 text-[15px] leading-relaxed text-muted">{card.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-xl text-center text-[12.5px] text-muted lg:max-w-none">
          Example forecasts. Percentages come from Predictly&rsquo;s probability
          engine using illustrative evidence weights, not from live research, and
          no source is being quoted.
        </p>
      </div>
    </section>
  );
}
