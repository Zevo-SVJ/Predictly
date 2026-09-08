import { PredictionInput } from "./PredictionInput";

/**
 * The whole proposition in one screen: a claim, one line of explanation, and
 * the real product control.
 *
 * There is deliberately no announcement badge and no mock product card. The
 * only "visual" is the tick rule beneath the input — a measuring scale from 0
 * to 100, which is what this product actually does.
 */
export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-28">
        <h1
          className="animate-rise-in text-[3rem] font-semibold leading-[0.95] sm:text-[4.5rem] md:text-[5.25rem]"
          style={{ animationDelay: "40ms" }}
        >
          Predict what
          <br />
          happens next.
        </h1>

        <p
          className="animate-rise-in mt-7 max-w-xl text-[17px] leading-relaxed text-muted sm:text-lg"
          style={{ animationDelay: "140ms" }}
        >
          Ask about any future event. Predictly researches the latest
          information and turns it into a probability.
        </p>

        <div className="animate-rise-in mt-10" style={{ animationDelay: "240ms" }}>
          <PredictionInput size="large" className="max-w-2xl" />
        </div>

        {/* Probability scale — the brand motif, and a hint at the output. */}
        <div
          className="animate-rise-in mt-12 max-w-2xl select-none"
          style={{ animationDelay: "340ms" }}
          aria-hidden
        >
          <div className="tick-rule h-2.5 w-full opacity-40" />
          <div className="mt-2 flex justify-between font-mono text-[10.5px] tracking-widest text-faint">
            <span>0%</span>
            <span>IMPOSSIBLE — CERTAIN</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
