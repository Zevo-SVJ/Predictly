import { Reveal } from "./Reveal";

/**
 * The one explanatory moment on the page, kept deliberately quiet: three words
 * in sequence with a rule running through them, and a single line underneath.
 * Everything else about the method is demonstrated by the section above it.
 */
const STEPS = [
  { label: "Ask", body: "A future question." },
  { label: "Research", body: "Current evidence, gathered on demand." },
  { label: "Forecast", body: "A probability, not a yes or no." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line py-16 sm:py-20">
      <div className="container-content">
        <Reveal>
          <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((step, index) => (
              <li key={step.label} className="relative">
                {/* Hairline connector, drawn only between items on wide screens. */}
                {index < STEPS.length - 1 ? (
                  <span
                    className="absolute left-full top-[0.85rem] hidden h-px w-8 bg-line sm:block"
                    aria-hidden
                  />
                ) : null}
                <p className="font-mono text-[11px] tracking-[0.2em] text-lime">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.03em]">
                  {step.label}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
