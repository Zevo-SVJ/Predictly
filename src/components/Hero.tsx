import { QuestionInput } from "./QuestionInput";
import { SignalField } from "./SignalField";
import { getTrendingEvents } from "@/lib/trending";

/**
 * The hero is the product, not a picture of it.
 *
 * No badge, no mock dashboard, and no probability rule: asking the visitor to
 * look at a 0–100 scale here confuses their own guess with Predictly's
 * forecast, which is the one distinction this page has to keep clear.
 *
 * The only atmosphere is the signal field drifting behind the type.
 */
export function Hero() {
  const examples = getTrendingEvents().slice(0, 5).map((event) => event.question);

  // Height is forced only from sm up. On a phone the content decides it, so the
  // input is never pushed below the fold by decorative space.
  return (
    <section className="grain relative flex flex-col justify-center overflow-hidden sm:min-h-[84vh]">
      <div className="rule-field pointer-events-none absolute inset-0" aria-hidden />
      <SignalField />

      <div className="container-canvas relative pb-16 pt-12 sm:pb-20 sm:pt-16">
        <p className="eyebrow animate-rise-in" style={{ animationDelay: "40ms" }}>
          Forecast the future
        </p>

        <h1
          className="animate-rise-in mt-5 max-w-[11ch] font-semibold leading-[0.9] tracking-[-0.045em]"
          style={{ fontSize: "var(--text-display)", animationDelay: "100ms" }}
        >
          What happens next?
        </h1>

        <p
          className="animate-rise-in mt-7 max-w-[44ch] leading-relaxed text-muted"
          style={{ fontSize: "var(--text-lead)", animationDelay: "180ms" }}
        >
          Ask about a future event. Predictly researches what&apos;s happening
          now and turns the evidence into a probability.
        </p>

        <div className="animate-rise-in mt-10 max-w-[62rem]" style={{ animationDelay: "260ms" }}>
          <QuestionInput size="hero" examples={examples} />
        </div>
      </div>
    </section>
  );
}
