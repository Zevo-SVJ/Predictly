import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Ask",
    body: "Ask about something that hasn't happened yet. No categories, no settings.",
  },
  {
    n: "02",
    title: "Research",
    body: "Predictly writes its own queries and searches recent information from the web.",
  },
  {
    n: "03",
    title: "Forecast",
    body: "Each source is weighed, and the evidence is converted into a probability.",
  },
];

/**
 * Three steps, set as an editorial list rather than a feature grid: hairline
 * rules, oversized numerals, and nothing boxed.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="max-w-md text-[2rem] font-semibold leading-[1.08] sm:text-[2.75rem]">
            How it works
          </h2>
        </Reveal>

        <ol className="mt-12 sm:mt-16">
          {STEPS.map((step, index) => (
            <Reveal key={step.n} delay={index * 0.08}>
              <li className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-t border-line py-7 sm:grid-cols-[6rem_10rem_1fr] sm:gap-x-10 sm:py-9">
                <span className="font-mono text-[13px] tabular-nums text-lime">{step.n}</span>
                <h3 className="text-xl font-medium sm:text-2xl">{step.title}</h3>
                <p className="col-start-2 mt-2 max-w-md text-[15px] leading-relaxed text-muted sm:col-start-3 sm:mt-0">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
