import { Check, Minus, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";

type Mark = "yes" | "partial" | "no";

const COLUMNS = [
  { id: "predictly", label: "Predictly", highlight: true },
  { id: "ai", label: "Generic AI", highlight: false },
  { id: "search", label: "Search", highlight: false },
] as const;

/**
 * Predictly against the two things it actually gets confused with.
 *
 * Honest columns, not a strawman: a chatbot genuinely researches sometimes and
 * will state a probability, and a search engine genuinely surfaces current
 * sources. Marking either at nothing across the board would make the Predictly
 * column unverifiable by association.
 *
 * Every Predictly row is something the code does: research through a live
 * provider, evidence stored per source, a deterministic probability, the full
 * outcome distribution, forecasts persisted with a resolution field, and a
 * pipeline whose first step is establishing that the event hasn't happened yet.
 */
const ROWS: { id: string; label: string; marks: Record<string, Mark> }[] = [
  {
    id: "research",
    label: "Researches current sources",
    marks: { predictly: "yes", ai: "partial", search: "yes" },
  },
  {
    id: "evidence",
    label: "Shows supporting evidence",
    marks: { predictly: "yes", ai: "partial", search: "partial" },
  },
  {
    id: "probability",
    label: "Produces explicit probabilities",
    marks: { predictly: "yes", ai: "partial", search: "no" },
  },
  {
    id: "outcomes",
    label: "Shows competing outcomes",
    marks: { predictly: "yes", ai: "no", search: "no" },
  },
  {
    id: "tracking",
    label: "Tracks forecasts to check later",
    marks: { predictly: "yes", ai: "no", search: "no" },
  },
  {
    id: "future",
    label: "Built specifically for future events",
    marks: { predictly: "yes", ai: "no", search: "no" },
  },
];

const MARKS = {
  yes: { Icon: Check, label: "Yes", tone: "bg-cobalt text-white" },
  partial: { Icon: Minus, label: "Partly", tone: "bg-hedge-soft text-hedge" },
  no: { Icon: X, label: "No", tone: "bg-canvas text-muted" },
} as const;

function MarkCell({ mark, srLabel }: { mark: Mark; srLabel: string }) {
  const config = MARKS[mark];
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn("flex size-6 shrink-0 items-center justify-center rounded-full", config.tone)}
        aria-hidden
      >
        <config.Icon className="size-3.5" strokeWidth={2.6} />
      </span>
      {/* The word travels with the shape, so the answer never rests on colour. */}
      <span className="text-[13px] text-muted">{config.label}</span>
      <span className="sr-only">{srLabel}</span>
    </span>
  );
}

export function Comparison() {
  return (
    <section id="compare" className="section-y scroll-mt-28 bg-canvas">
      <div className="container-page">
        <SectionHeader
          eyebrow="How we compare"
          title="How Predictly compares to other ways of finding answers."
        >
          A search engine hands you documents. A chatbot gives a number without
          the arithmetic. Neither was built to tell you how likely something is.
        </SectionHeader>

        <div className="surface mx-auto mt-14 max-w-4xl overflow-hidden px-6 py-8 sm:mt-20 sm:px-10 sm:py-10">
          <div className="hidden grid-cols-[1.5fr_repeat(3,1fr)] gap-4 border-b border-border pb-5 md:grid">
            <span className="label">Capability</span>
            {COLUMNS.map((column) => (
              <span
                key={column.id}
                className={cn(
                  "text-[13.5px] font-semibold",
                  column.highlight ? "text-cobalt" : "text-muted",
                )}
              >
                {column.label}
              </span>
            ))}
          </div>

          <ul className="divide-y divide-border">
            {ROWS.map((row) => (
              <li
                key={row.id}
                className="grid gap-3 py-6 md:grid-cols-[1.5fr_repeat(3,1fr)] md:items-center md:gap-4"
              >
                <p className="text-[16px] leading-snug text-ink md:text-[15.5px]">{row.label}</p>

                {/* On a phone the three answers sit as labelled tiles under the
                    capability. Four columns at 375px can only survive by
                    scrolling sideways or shrinking past readability. */}
                <div className="grid grid-cols-3 gap-2 md:contents">
                  {COLUMNS.map((column) => (
                    <div
                      key={column.id}
                      className={cn(
                        "min-w-0 rounded-[var(--radius-sm)] px-3 py-2.5 md:bg-transparent md:p-0",
                        column.highlight ? "bg-cobalt-soft" : "bg-canvas",
                      )}
                    >
                      <span
                        className={cn(
                          "mb-1.5 block truncate text-[11px] md:sr-only",
                          column.highlight ? "font-semibold text-cobalt" : "text-muted",
                        )}
                      >
                        {column.label}
                      </span>
                      <MarkCell mark={row.marks[column.id] ?? "no"} srLabel={column.label} />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
