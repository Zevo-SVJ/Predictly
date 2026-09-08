import { QuestionInput } from "./QuestionInput";
import { getTrendingEvents } from "@/lib/trending";

/**
 * The closing moment, full-bleed and dark, ending on the same object the page
 * opened with: a working input. A visitor who scrolled this far shouldn't have
 * to scroll back up to act.
 *
 * Deliberately not wrapped in a scroll reveal — the primary conversion element
 * must be painted whether or not an IntersectionObserver ever fires.
 */
export function FinalCta() {
  const examples = getTrendingEvents().slice(0, 4).map((event) => event.question);

  return (
    <section className="grain relative overflow-hidden border-t border-line">
      <div className="rule-field pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-canvas relative py-24 sm:py-36">
        <h2
          className="max-w-[11ch] font-semibold leading-[0.9] tracking-[-0.045em]"
          style={{ fontSize: "var(--text-display)" }}
        >
          What happens next?
        </h2>

        <div className="mt-10 max-w-[62rem] sm:mt-14">
          <QuestionInput size="hero" examples={examples} />
        </div>
      </div>
    </section>
  );
}
