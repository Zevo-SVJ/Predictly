import { Reveal } from "./Reveal";

/**
 * The one explanatory section on the page. Three short facts about how the
 * number is produced — no cards, no icons, no repetition of the examples above.
 */
const POINTS = [
  { label: "Research", body: "Evidence gathered from current sources, on demand." },
  { label: "Forecast", body: "A probability, not a binary answer." },
  { label: "Freshness", body: "The forecast reflects what is known right now." },
];

export function TrustStrip() {
  return (
    <section className="section-y border-t border-line">
      <div className="container-wide">
        <Reveal>
          <h2
            className="max-w-[18ch] font-semibold leading-[0.98] tracking-[-0.04em]"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Current information.
            <br />
            <span className="text-faint">Future outcomes.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Predictly searches the web, weighs the relevant evidence, and turns
            it into a probability for a future event.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-12 grid gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-3">
            {POINTS.map((point) => (
              <div key={point.label}>
                <dt className="text-[14px] font-medium text-fg">{point.label}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-muted">{point.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
