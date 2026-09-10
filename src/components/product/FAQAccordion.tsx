import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqEntry {
  q: string;
  a: string;
}

/**
 * Built on `<details>` rather than on state.
 *
 * That gives correct keyboard and screen-reader behaviour for free, keeps every
 * answer in the markup when JavaScript is off, and lets the open/close
 * transition live in CSS. These are the answers most likely to decide whether
 * someone trusts the product; none of them should depend on hydration.
 */
export function FAQAccordion({ entries, className }: { entries: FaqEntry[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {entries.map((entry) => (
        <li
          key={entry.q}
          className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-card)]"
        >
          <details className="accordion group">
            <summary
              className={cn(
                "flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-7 sm:px-8",
                "text-[18px] font-medium leading-snug tracking-[-0.02em] text-ink transition-colors",
                "hover:text-cobalt sm:text-[19px]",
              )}
            >
              {entry.q}
              <span
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-canvas text-muted transition-all duration-300 group-open:rotate-45 group-open:border-cobalt group-open:bg-cobalt-soft group-open:text-cobalt"
                aria-hidden
              >
                <Plus className="size-4" />
              </span>
            </summary>
            <p className="px-6 pb-7 pr-12 text-[15.5px] leading-relaxed text-muted sm:px-8 sm:pr-16">
              {entry.a}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
