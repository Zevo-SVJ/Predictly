import { PredictionInput } from "./PredictionInput";
import { TrendingRail } from "./TrendingRail";
import { getTrendingRails } from "@/lib/data/trending";

/**
 * The whole value proposition above the fold: what it does, the real input, and
 * a live sense of what people are curious about.
 */
export function Hero() {
  const [railOne, railTwo] = getTrendingRails();

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-field pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
          <span className="size-1.5 rounded-full bg-lime" aria-hidden />
          Free for everyone during launch
        </p>

        <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl md:text-7xl">
          Predict what
          <br />
          happens next.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Ask about any future event. Predictly researches the latest
          information and turns it into a probability-based forecast.
        </p>

        <PredictionInput className="mt-8 max-w-2xl" size="large" />

        <p className="mt-3 pl-1 text-xs text-faint">
          Try “Will GTA VI be delayed again?” or “Who will win the next F1 Grand Prix?”
        </p>
      </div>

      <div id="worth-predicting" className="relative scroll-mt-20 pb-12 sm:pb-16">
        <p className="mx-auto mb-3 max-w-6xl px-4 text-xs uppercase tracking-widest text-faint sm:px-6">
          Worth predicting
        </p>
        <div className="space-y-2.5">
          <TrendingRail events={railOne} direction="left" durationSeconds={80} />
          <TrendingRail events={railTwo} direction="right" durationSeconds={95} />
        </div>
      </div>
    </section>
  );
}
