import { Reveal } from "./Reveal";

/**
 * Three stages of one mechanism, drawn as a continuous run rather than three
 * cards: a single rule crosses the whole section and each stage sits on it.
 *
 * Deliberately no example questions — this section is about how the product
 * works, and the page already shows plenty of questions elsewhere.
 */
const STAGES = [
  { n: "01", label: "Ask", body: "Ask Predictly about something that hasn't happened yet." },
  { n: "02", label: "Research", body: "Predictly investigates current evidence and relevant sources." },
  { n: "03", label: "Forecast", body: "The evidence is synthesised into a probability." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line py-16 sm:py-24">
      <div className="container-canvas">
        <Reveal>
          <p className="eyebrow">How it works</p>
        </Reveal>

        <Reveal delay={0.05}>
          <ol className="relative mt-10 grid gap-10 sm:grid-cols-3 sm:gap-10">
            {/* The rule the stages sit on — one system, not three boxes. */}
            <span
              className="absolute left-0 right-0 top-[0.7rem] hidden h-px bg-line sm:block"
              aria-hidden
            />

            {STAGES.map((stage) => (
              <li key={stage.n} className="relative">
                <span
                  className="absolute -top-[0.15rem] left-0 hidden size-[7px] rounded-full bg-lime sm:block"
                  aria-hidden
                />
                <div className="sm:pt-8">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-lime sm:hidden">
                    {stage.n}
                  </p>
                  <h3 className="mt-3 text-[1.75rem] font-semibold leading-none tracking-[-0.035em] sm:mt-0">
                    {stage.label}
                  </h3>
                  <p className="mt-3.5 max-w-[34ch] text-[15px] leading-relaxed text-muted">
                    {stage.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
