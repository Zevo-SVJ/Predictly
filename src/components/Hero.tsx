import { QuestionInput } from "./QuestionInput";
import { getTrendingEvents } from "@/lib/trending";

/**
 * The hero is the product, not a picture of it.
 *
 * No badge, no mock dashboard, no illustration. Display type at the top of the
 * scale, one line of copy, and the real input — with the questions people are
 * actually asking cycling through it as an invitation to type.
 *
 * The only ornament is a slow data trace and a 0–100 rule: forecasting's own
 * visual language rather than borrowed AI decoration.
 */
export function Hero() {
  const examples = getTrendingEvents().slice(0, 6).map((event) => event.question);

  return (
    <section className="grain relative overflow-hidden border-b border-line">
      <BackgroundTrace />

      <div className="container-wide relative pb-20 pt-16 sm:pb-28 sm:pt-24">
        <p className="eyebrow animate-rise-in" style={{ animationDelay: "40ms" }}>
          Forecast the future
        </p>

        <h1
          className="animate-rise-in mt-6 max-w-[14ch] font-semibold leading-[0.86] tracking-[-0.045em]"
          style={{ fontSize: "var(--text-display)", animationDelay: "100ms" }}
        >
          What happens next?
        </h1>

        <p
          className="animate-rise-in mt-8 max-w-[46ch] leading-relaxed text-muted"
          style={{ fontSize: "var(--text-lead)", animationDelay: "200ms" }}
        >
          Ask about a future event. Predictly researches what&apos;s happening
          now and turns the evidence into a probability.
        </p>

        <div className="animate-rise-in mt-10 max-w-3xl" style={{ animationDelay: "290ms" }}>
          <QuestionInput size="hero" examples={examples} />
        </div>

        {/* Probability scale: a measuring instrument, and a hint at the output. */}
        <div
          className="animate-rise-in mt-14 max-w-3xl select-none"
          style={{ animationDelay: "380ms" }}
          aria-hidden
        >
          <div className="tick-rule h-3 w-full opacity-45" />
          <div className="mt-2.5 flex justify-between font-mono text-[10.5px] tracking-[0.18em] text-faint">
            <span>0 · IMPOSSIBLE</span>
            <span className="hidden sm:inline">EVIDENCE DECIDES</span>
            <span>CERTAIN · 100</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A slow probability trace drifting behind the hero.
 *
 * Two copies of one path translating by -50% for a seamless loop: a single
 * GPU-composited transform, no canvas, no WebGL, no per-frame JavaScript.
 */
function BackgroundTrace() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] overflow-hidden opacity-[0.13]"
      aria-hidden
    >
      <div className="animate-trace flex h-full w-[200%]">
        <TraceSvg />
        <TraceSvg />
      </div>
    </div>
  );
}

function TraceSvg() {
  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="none"
      className="h-full w-1/2 shrink-0"
      role="presentation"
    >
      <path
        d="M0 235 L90 232 L150 205 L210 212 L280 160 L340 172 L410 128 L470 140 L540 96 L610 118 L680 74 L760 92 L830 52 L900 70 L980 38 L1060 54 L1130 26 L1200 34"
        fill="none"
        stroke="var(--color-lime)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
