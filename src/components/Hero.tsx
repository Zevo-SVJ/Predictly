import { QuestionInput } from "./QuestionInput";
import { getTrendingEvents } from "@/lib/trending";

/**
 * The hero is the product, not a picture of it.
 *
 * No badge, no mock UI, no cards floating beside the input. The type dominates
 * but is sized so the input keeps visual weight and the next section is visible
 * below the fold — the composition decides the scale, not the maximum.
 *
 * Exactly one example is ever on screen: it cycles through the input's
 * placeholder while the field is empty.
 */
export function Hero() {
  const examples = getTrendingEvents().slice(0, 5).map((event) => event.question);

  // Height is forced only from sm up. On a phone the content decides it, so the
  // input is never pushed below the fold by decorative space.
  return (
    <section className="grain relative flex flex-col justify-center overflow-hidden sm:min-h-[86vh]">
      <BackgroundTrace />

      <div className="container-wide relative pb-14 pt-10 sm:py-20">
        <p className="eyebrow animate-rise-in" style={{ animationDelay: "40ms" }}>
          Forecast the future
        </p>

        <h1
          className="animate-rise-in mt-5 max-w-[12ch] font-semibold leading-[0.92] tracking-[-0.045em]"
          style={{ fontSize: "var(--text-display)", animationDelay: "100ms" }}
        >
          What happens next?
        </h1>

        <p
          className="animate-rise-in mt-6 max-w-[44ch] leading-relaxed text-muted"
          style={{ fontSize: "var(--text-lead)", animationDelay: "180ms" }}
        >
          Ask about a future event. Predictly researches what&apos;s happening
          now and turns the evidence into a forecast.
        </p>

        <div className="animate-rise-in mt-9 max-w-2xl" style={{ animationDelay: "260ms" }}>
          <QuestionInput size="hero" examples={examples} />
        </div>

        <div
          className="animate-rise-in mt-10 max-w-2xl select-none"
          style={{ animationDelay: "340ms" }}
          aria-hidden
        >
          <div className="tick-rule h-2.5 w-full opacity-40" />
          <div className="mt-2.5 flex justify-between font-mono text-[10px] tracking-[0.18em] text-faint">
            <span>0 · IMPOSSIBLE</span>
            <span>CERTAIN · 100</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A slow probability trace behind the hero. Two copies of one path translating
 * by -50% for a seamless loop: one GPU-composited transform, no canvas, no
 * WebGL, no per-frame JavaScript.
 */
function BackgroundTrace() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] overflow-hidden opacity-[0.11]"
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
    <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="h-full w-1/2 shrink-0" role="presentation">
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
