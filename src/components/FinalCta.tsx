import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The closing call to action.
 *
 * Deliberately not wrapped in a scroll reveal: this is the page's primary
 * conversion element, and it must be painted whether or not an
 * IntersectionObserver ever fires.
 */
export function FinalCta() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-36">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-lg text-[2.5rem] font-semibold leading-[0.98] sm:text-[4rem]">
            See what
            <br />
            happens next.
          </h2>

          <Link
            href="/predict"
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-lime px-7 py-4 text-[15px] font-medium text-lime-ink transition-all duration-200 hover:bg-lime-dim active:scale-[0.97]"
          >
            Make a prediction
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
