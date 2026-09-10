import { ComparisonTable } from "../product/ComparisonTable";

/**
 * What Predictly is, by way of what it isn't.
 *
 * Six rows, four columns, no marketing adjectives. The point of the section is
 * to stop a first-time visitor filing Predictly under "chatbot" or under
 * "betting site", both of which it gets mistaken for and neither of which it is.
 */
export function Comparison() {
  return (
    <section id="compare" className="section-y scroll-mt-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">Where it fits</p>
          <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
            Closer to a research desk than a chatbot.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            A search engine hands you documents. A chatbot will give you a number
            but not the arithmetic. A prediction market prices an outcome with
            traders&rsquo; money and never explains itself.
          </p>
        </div>

        <ComparisonTable className="mt-10 sm:mt-12" />
      </div>
    </section>
  );
}
