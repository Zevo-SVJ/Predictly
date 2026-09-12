import { Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

/**
 * Six questions, built on `<details>`.
 *
 * That gives correct keyboard and screen-reader behaviour for free, keeps every
 * answer in the markup when JavaScript is off, and leaves the open/close
 * transition to CSS. These are the answers most likely to decide whether
 * someone trusts the product; none of them should depend on hydration.
 *
 * The accuracy answer refuses to give a figure on purpose. There isn't one yet.
 */
const ENTRIES = [
  {
    q: "How does Predictly calculate probabilities?",
    a: "It restates your question as an event that can be settled, searches the web for it, reads what it finds, and scores each source on four things: which outcome it points to and how strongly, how reliable the publisher is, how relevant it is to your exact question, and how recently it was written. Those scores multiply into one weight per source, and the weights are aggregated against a base rate. The arithmetic is deterministic — the same evidence produces the same number every time.",
  },
  {
    q: "Where does Predictly get its research?",
    a: "From the live web, at the moment you ask. There is no cached answer waiting. It follows what it finds and reads the actual article text rather than a search snippet, and ten reprints of one wire story collapse into a single source rather than counting ten times.",
  },
  {
    q: "Can I make a prediction without signing up?",
    a: "Yes. Ask, watch the research run and read the whole result — every source, every weight — without an account. Signing in exists only so the forecasts you want to keep stay in one place and can be checked later against what actually happened.",
  },
  {
    q: "How current is the research?",
    a: "It runs at the moment you ask — there is no cached answer waiting. Each source's publication date feeds into its weight, so older material still counts but counts less, and a forecast resting entirely on old evidence is capped at medium confidence however unanimous it is.",
  },
  {
    q: "Does Predictly guarantee an outcome?",
    a: "No, and any forecasting product that suggests otherwise is selling something else. A probability is a description of uncertainty: a 70% forecast that doesn't happen is not automatically wrong — three in ten of them are supposed to miss. What Predictly can do is make the reasoning behind the number inspectable, so you can disagree with it on the evidence.",
  },
  {
    q: "Can I save my predictions?",
    a: "Yes, against an account. A saved forecast keeps its sources and its number, gets a shareable link, and carries a resolution field so it can be marked right or wrong once the event settles. It isn't listed publicly unless you share the link yourself.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-y scroll-mt-28">
      <div className="container-page">
        <SectionHeader eyebrow="FAQ" title="Common questions." />

        <ul className="mx-auto mt-14 max-w-3xl space-y-3 sm:mt-20">
          {ENTRIES.map((entry) => (
            <li
              key={entry.q}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-card)]"
            >
              <details className="accordion group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-7 text-[18px] font-medium leading-snug tracking-[-0.02em] text-ink transition-colors hover:text-cobalt sm:px-8 sm:text-[19px]">
                  {entry.q}
                  <span
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-canvas text-muted transition-all duration-300 group-open:rotate-45 group-open:border-cobalt group-open:bg-cobalt-soft group-open:text-cobalt"
                    aria-hidden
                  >
                    <Plus className="size-4" />
                  </span>
                </summary>
                <p className="px-6 pb-7 pr-12 text-[15.5px] leading-relaxed text-muted sm:px-8 sm:pr-16">
                  {entry.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
