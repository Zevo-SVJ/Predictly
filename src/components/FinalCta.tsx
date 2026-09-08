import { QuestionInput } from "./QuestionInput";
import { SignalField } from "./SignalField";
import { getTrendingEvents } from "@/lib/trending";

/**
 * The close: the page ends on the same object it opened with, so a visitor who
 * scrolled this far doesn't have to scroll back up to act.
 *
 * It echoes the hero without repeating it — centred rather than left-aligned,
 * one line of copy rather than a proposition, and a quieter signal field.
 *
 * Deliberately not wrapped in a scroll reveal: the primary conversion element
 * must be painted whether or not an IntersectionObserver ever fires.
 */
export function FinalCta() {
  const examples = getTrendingEvents().slice(0, 4).map((event) => event.question);

  return (
    <section className="grain relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
        <SignalField />
      </div>

      <div className="container-canvas relative flex flex-col items-center py-24 text-center sm:py-36">
        <p className="eyebrow">Ask Predictly</p>
        <h2
          className="mt-5 max-w-[14ch] font-semibold leading-[0.9] tracking-[-0.045em]"
          style={{ fontSize: "var(--text-h1)" }}
        >
          What happens next?
        </h2>

        <div className="mt-10 w-full max-w-[52rem] text-left sm:mt-12">
          <QuestionInput size="hero" examples={examples} />
        </div>
      </div>
    </section>
  );
}
