import { SectionEyebrow } from "./SectionEyebrow";
import { ComparisonTable } from "../product/ComparisonTable";

/**
 * What Predictly is, by way of what it isn't.
 *
 * One large table on one white surface — the point is to stop a first-time
 * visitor filing Predictly under "chatbot" or under "betting site", both of
 * which it gets mistaken for and neither of which it is.
 */
export function Comparison() {
  return (
    <section id="compare" className="section-y scroll-mt-28 bg-canvas">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>How we compare</SectionEyebrow>
          <h2 className="mt-6 text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.04em]">
            How Predictly compares.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-muted">
            A search engine hands you documents. A chatbot gives a number without
            the arithmetic. A market prices an outcome and never explains itself.
          </p>
        </div>

        <ComparisonTable className="mx-auto mt-14 max-w-4xl sm:mt-20" />
      </div>
    </section>
  );
}
