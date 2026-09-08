import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The closing invitation.
 *
 * Deliberately not wrapped in a scroll reveal: this is the page's primary
 * conversion element and must be painted whether or not an
 * IntersectionObserver ever fires.
 */
export function FinalCta() {
  return (
    <section className="grain relative overflow-hidden border-b border-line">
      <div className="container-wide relative py-28 sm:py-44">
        <h2
          className="max-w-[13ch] font-semibold leading-[0.88]"
          style={{ fontSize: "var(--text-h1)" }}
        >
          What do you think happens next?
        </h2>

        <Link
          href="/predict"
          className="group mt-12 inline-flex items-center gap-3 rounded-full bg-lime px-8 py-4 text-[15px] font-medium text-lime-ink transition-all duration-200 hover:bg-lime-dim active:scale-[0.97] sm:mt-16"
        >
          Ask Predictly
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
