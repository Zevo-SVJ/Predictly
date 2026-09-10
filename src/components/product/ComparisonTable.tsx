import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Support = "yes" | "no" | "partial";

interface Column {
  id: string;
  name: string;
  highlight?: boolean;
}

interface Row {
  id: string;
  label: string;
  /** Keyed by column id. */
  values: Record<string, Support>;
}

const COLUMNS: Column[] = [
  { id: "predictly", name: "Predictly", highlight: true },
  { id: "search", name: "Search engine" },
  { id: "chatbot", name: "AI chatbot" },
  { id: "market", name: "Prediction market" },
];

/**
 * What each tool actually does, not what it markets itself as.
 *
 * Every "no" here is defensible: a search engine returns documents and leaves
 * the weighing to you; a chatbot will state a probability but cannot show the
 * arithmetic behind it; a prediction market produces an excellent number from
 * traders' money rather than from evidence, and gives no reasoning at all.
 */
const ROWS: Row[] = [
  {
    id: "evidence",
    label: "Researches current evidence",
    values: { predictly: "yes", search: "yes", chatbot: "partial", market: "no" },
  },
  {
    id: "future",
    label: "Built for events that haven't happened",
    values: { predictly: "yes", search: "no", chatbot: "no", market: "yes" },
  },
  {
    id: "probability",
    label: "Returns a probability",
    values: { predictly: "yes", search: "no", chatbot: "partial", market: "yes" },
  },
  {
    id: "reasoning",
    label: "Shows the sources behind the number",
    values: { predictly: "yes", search: "partial", chatbot: "partial", market: "no" },
  },
  {
    id: "tracking",
    label: "Keeps the forecast to be checked later",
    values: { predictly: "yes", search: "no", chatbot: "no", market: "yes" },
  },
  {
    id: "stake",
    label: "No money at stake",
    values: { predictly: "yes", search: "yes", chatbot: "yes", market: "no" },
  },
];

const MARKS: Record<Support, { icon: typeof Check; label: string; className: string }> = {
  yes: { icon: Check, label: "Yes", className: "text-supports bg-supports-soft" },
  partial: { icon: Minus, label: "Partly", className: "text-hedge bg-hedge-soft" },
  no: { icon: X, label: "No", className: "text-counters bg-counters-soft" },
};

function Mark({ support }: { support: Support }) {
  const mark = MARKS[support];
  const Icon = mark.icon;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("flex size-5 items-center justify-center rounded-full", mark.className)}
        aria-hidden
      >
        <Icon className="size-3" strokeWidth={2.5} />
      </span>
      {/* The word travels with the icon so the answer never depends on colour. */}
      <span className="text-[12.5px] text-muted md:sr-only">{mark.label}</span>
    </span>
  );
}

/**
 * Two renderings of one dataset.
 *
 * A four-column table is the right shape on a desktop and the wrong one on a
 * 375px screen, where it can only survive by scrolling sideways or shrinking
 * past readability. Mobile gets the same rows regrouped as stacked blocks
 * instead — the data is single-sourced above, only the layout differs.
 */
export function ComparisonTable({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* ---- desktop ---- */}
      <table className="hidden w-full border-collapse md:table">
        <caption className="sr-only">
          How Predictly compares with a search engine, an AI chatbot and a prediction market
        </caption>
        <thead>
          <tr>
            <th scope="col" className="w-[38%] pb-4 text-left align-bottom">
              <span className="eyebrow">Capability</span>
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  "pb-4 text-left align-bottom text-[14px] font-semibold",
                  column.highlight ? "text-cobalt" : "text-muted",
                )}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.id} className="border-t border-border">
              <th scope="row" className="py-4 pr-6 text-left text-[14.5px] font-normal text-ink">
                {row.label}
              </th>
              {COLUMNS.map((column) => (
                <td
                  key={column.id}
                  className={cn("py-4", column.highlight && "bg-cobalt-soft/50")}
                >
                  <Mark support={row.values[column.id] ?? "no"} />
                  <span className="sr-only">
                    {column.name}: {MARKS[row.values[column.id] ?? "no"].label}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---- mobile ---- */}
      <ul className="space-y-3 md:hidden">
        {ROWS.map((row) => (
          <li
            key={row.id}
            className="rounded-[var(--radius-md)] border border-border bg-white p-4"
          >
            <p className="text-[14.5px] font-medium leading-snug text-ink">{row.label}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {COLUMNS.map((column) => (
                <div key={column.id} className="min-w-0">
                  <dt
                    className={cn(
                      "truncate text-[11px]",
                      column.highlight ? "font-semibold text-cobalt" : "text-muted",
                    )}
                  >
                    {column.name}
                  </dt>
                  <dd className="mt-1">
                    <Mark support={row.values[column.id] ?? "no"} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
