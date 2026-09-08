import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The closing invitation, pointing straight back at the input.
 *
 * Deliberately not wrapped in a scroll reveal: this is the page's primary
 * conversion element and must be painted whether or not an
 * IntersectionObserver ever fires.
 */
export function FinalCta() {
  return (
    <section className="grain relative overflow-hidden border-t border-line">
      <div className="container-wide relative py-20 sm:py-28">
        <h2
          className="font-semibold leading-[0.95] tracking-[-0.045em]"
          style={{ fontSize: "var(--text-h1)" }}
        >
          What happens next?
        </h2>

        <Link
          href="/predict"
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-lime px-7 py-3.5 text-[15px] font-medium text-lime-ink transition-all duration-200 hover:bg-lime-dim active:scale-[0.97]"
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
