import { TrendingTicker } from "./TrendingTicker";
import { getTrendingEvents } from "@/lib/trending";

/**
 * One discovery rail, not two.
 *
 * Topic labels only — the full questions live in the input and the category
 * field, and repeating them here would be the third time a visitor reads the
 * same list. Tapping an item loads its question into the prediction flow.
 */
export function OnTheRadar() {
  const events = getTrendingEvents().slice(0, 8);

  return (
    <section id="radar" className="scroll-mt-20 border-y border-line">
      <div className="container-canvas flex items-center py-4">
        <h2 className="eyebrow shrink-0">On the radar</h2>
      </div>
      {/* Edge to edge on purpose: the rail crossing the full viewport is one of
          the moments that stops the page reading as a column of cards. */}
      <div className="border-t border-line">
        <TrendingTicker events={events} direction="left" durationSeconds={110} />
      </div>
    </section>
  );
}
