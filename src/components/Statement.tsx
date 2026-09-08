import { Reveal } from "./Reveal";

/**
 * The brand statement. One idea, set large, with the mechanism underneath it.
 * No cards, no icons — this section exists to be read and remembered.
 */
export function Statement() {
  return (
    <section className="grain relative overflow-hidden border-b border-line">
      <div className="container-wide section-y relative">
        <Reveal>
          <h2
            className="max-w-[16ch] font-semibold leading-[0.9]"
            style={{ fontSize: "var(--text-h1)" }}
          >
            The future is uncertain.
            <br />
            <span className="text-faint">The information isn&apos;t.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:mt-20 md:grid-cols-3 md:gap-14">
            <p className="text-[15px] leading-relaxed text-muted">
              Every future event is already surrounded by signal — announcements,
              filings, fixtures, reporting, data. It is scattered, uneven in
              quality, and stale the moment you stop looking.
            </p>
            <p className="text-[15px] leading-relaxed text-muted">
              Predictly gathers it on demand, discards the duplicates, and judges
              each source on how much it should actually move a forecaster.
            </p>
            <p className="text-[15px] leading-relaxed text-muted">
              What comes back is a number you can interrogate: every source
              listed, every factor named, and the reasoning tied to both.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
