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
    <ul className={cn("divide-y divide-border border-y border-border", className)}>
      {entries.map((entry) => (
        <li key={entry.q}>
          <details className="accordion group">
            <summary
              className={cn(
                "flex cursor-pointer list-none items-start justify-between gap-6 py-5",
                "text-[16px] font-medium leading-snug text-ink transition-colors",
                "hover:text-cobalt sm:text-[17px]",
              )}
            >
              {entry.q}
              <span
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 group-open:rotate-45 group-open:border-cobalt group-open:text-cobalt"
                aria-hidden
              >
                <Plus className="size-3.5" />
              </span>
            </summary>
            <p className="pb-6 pr-8 text-[14.5px] leading-relaxed text-muted">{entry.a}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
