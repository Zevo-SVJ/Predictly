import { TrendingTicker } from "./TrendingTicker";
import { getTrendingProvider, getTrendingRails } from "@/lib/trending";

/**
 * Two counter-scrolling tickers directly under the hero.
 *
 * The label says "asking right now" about the questions, not about the data
 * feed: the current provider is a curated list and the note under the heading
 * says exactly that. No "LIVE" badge until something is actually live.
 */
export function TrendingSection() {
  const [top, bottom] = getTrendingRails();
  const provider = getTrendingProvider();

  return (
    <section id="trending" className="scroll-mt-20 border-b border-line py-12 sm:py-16">
      <div className="container-wide mb-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 className="text-[15px] font-medium text-fg">
          Questions people are asking right now
        </h2>
        <p className="text-[13px] text-faint">
          {provider.isLive
            ? "Ranked from live signal."
            : "A curated set of open questions — tap one to forecast it."}
        </p>
      </div>

      <div className="border-y border-line">
        <TrendingTicker events={top} direction="left" durationSeconds={130} />
        <div className="border-t border-line">
          <TrendingTicker events={bottom} direction="right" durationSeconds={155} />
        </div>
      </div>
    </section>
  );
}
