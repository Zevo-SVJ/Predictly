import { Check, Minus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";

type Mark = "yes" | "partial" | "no";

/**
 * Predictly against the thing it is most often confused with.
 *
 * Two columns rather than four, and the second is "asking a chatbot" rather
 * than a blanket "other tools" — a column that scored every alternative at
 * nothing would be a strawman, and the rows below would stop being checkable.
 * A chatbot genuinely does some of this, so it is marked as doing some of it.
 *
 * Every Predictly row is something the code actually does: research through a
 * live provider, evidence stored per source, a deterministic probability, named
 * sources on the result, a separate confidence score, and forecasts persisted
 * against an account.
 */
const ROWS: { id: string; label: string; predictly: Mark; chatbot: Mark; note: string }[] = [
  {
    id: "research",
    label: "Searches the web when you ask",
    predictly: "yes",
    chatbot: "partial",
    note: "Only when it decides to, and rarely for the exact question.",
  },
  {
    id: "evidence",
    label: "Shows the evidence it used",
    predictly: "yes",
    chatbot: "partial",
    note: "Cites sometimes; the citation may not be what moved the answer.",
  },
  {
    id: "probability",
    label: "Returns a probability",
    predictly: "yes",
    chatbot: "partial",
    note: "Will state a number, but not the arithmetic behind it.",
  },
  {
    id: "attribution",
    label: "Names every source behind the number",
    predictly: "yes",
    chatbot: "no",
    note: "",
  },
  {
    id: "confidence",
    label: "Separates confidence from probability",
    predictly: "yes",
    chatbot: "no",
    note: "",
  },
  {
    id: "saved",
    label: "Keeps the forecast to check later",
    predictly: "yes",
    chatbot: "no",
    note: "",
  },
];

function MarkCell({ mark, className }: { mark: Mark; className?: string }) {
  const config = {
    yes: { Icon: Check, label: "Yes", tone: "bg-cobalt text-white" },
    partial: { Icon: Minus, label: "Partly", tone: "bg-hedge-soft text-hedge" },
    no: { Icon: Minus, label: "No", tone: "bg-canvas text-muted" },
  }[mark];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn("flex size-6 items-center justify-center rounded-full", config.tone)}
        aria-hidden
      >
        <config.Icon className="size-3.5" strokeWidth={2.6} />
      </span>
      {/* The word travels with the shape, so the answer never rests on colour. */}
      <span className="text-[13px] text-muted">{config.label}</span>
    </span>
  );
}

export function Comparison() {
  return (
    <section id="compare" className="section-y scroll-mt-28 bg-canvas">
      <div className="container-page">
        <SectionHeader eyebrow="How we compare" title="How Predictly compares to just asking.">
          A chatbot will happily give you a number. What it will not give you is
          the evidence that produced it, or a way to check it later.
        </SectionHeader>

        <div className="surface mx-auto mt-14 max-w-3xl overflow-hidden px-6 py-8 sm:mt-20 sm:px-10 sm:py-10">
          <div className="hidden grid-cols-[1.6fr_1fr_1fr] gap-4 border-b border-border pb-5 sm:grid">
            <span className="label">Capability</span>
            <span className="text-[13.5px] font-semibold text-cobalt">Predictly</span>
            <span className="text-[13.5px] font-semibold text-muted">Asking a chatbot</span>
          </div>

          <ul className="divide-y divide-border">
            {ROWS.map((row) => (
              <li
                key={row.id}
                className="grid gap-3 py-6 sm:grid-cols-[1.6fr_1fr_1fr] sm:items-center sm:gap-4"
              >
                <p className="text-[16px] leading-snug text-ink sm:text-[15.5px]">{row.label}</p>

                {/* Mobile keeps the two answers side by side under the
                    capability; four-column grids at 375px only survive by
                    scrolling sideways or shrinking past readability. */}
                <div className="grid grid-cols-2 gap-3 sm:contents">
                  <div className="rounded-[var(--radius-sm)] bg-cobalt-soft px-3 py-2.5 sm:bg-transparent sm:p-0">
                    <span className="mb-1.5 block text-[11px] font-semibold text-cobalt sm:sr-only">
                      Predictly
                    </span>
                    <MarkCell mark={row.predictly} />
                  </div>
                  <div className="rounded-[var(--radius-sm)] bg-canvas px-3 py-2.5 sm:bg-transparent sm:p-0">
                    <span className="mb-1.5 block text-[11px] text-muted sm:sr-only">Chatbot</span>
                    <MarkCell mark={row.chatbot} />
                    {row.note ? (
                      <span className="mt-1.5 block text-[12px] leading-snug text-muted sm:mt-1">
                        {row.note}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
