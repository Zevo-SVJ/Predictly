import { TrendingRail } from "./TrendingRail";
import { getTrendingProvider, getTrendingRails } from "@/lib/trending";

/**
 * Two rails of genuinely open questions.
 *
 * The heading says "Trending predictions", never "live" — the current provider
 * is a curated set, and the copy under the heading says so plainly.
 */
export function TrendingSection() {
  const [top, bottom] = getTrendingRails();
  const provider = getTrendingProvider();

  return (
    <section id="trending" className="scroll-mt-24 border-t border-line py-14 sm:py-20">
      <div className="mx-auto mb-8 flex max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 sm:px-8">
        <h2 className="text-[13px] uppercase tracking-[0.18em] text-faint">
          Trending predictions
        </h2>
        <p className="text-[13px] text-faint">
          {provider.isLive
            ? "Updated from live signal."
            : "A curated set of open questions. Tap one to forecast it."}
        </p>
      </div>

      <div className="space-y-3">
        <TrendingRail events={top} direction="left" durationSeconds={120} />
        <TrendingRail events={bottom} direction="right" durationSeconds={140} />
      </div>
    </section>
  );
}
