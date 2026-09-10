"use client";

import { cn } from "@/lib/utils";

/** Three or four questions. Never a catalogue — a wall of examples turns the
 * first decision on the page into a reading task. */
export const MAX_SUGGESTIONS = 3;

export function SuggestionChips({
  questions,
  onSelect,
  className,
}: {
  questions: string[];
  onSelect: (question: string) => void;
  className?: string;
}) {
  const shown = questions.slice(0, MAX_SUGGESTIONS);
  if (shown.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {shown.map((question) => (
        <li key={question}>
          <button
            type="button"
            onClick={() => onSelect(question)}
            className={cn(
              // 44px tall on a phone — a 36px chip is a miss-prone target for
              // the primary way most visitors will start a forecast.
              "flex min-h-11 items-center rounded-full border border-border bg-white px-4 text-left sm:min-h-0 sm:py-2",
              "text-[13px] leading-snug text-muted transition-all duration-200",
              "hover:border-cobalt-line hover:bg-cobalt-soft hover:text-cobalt active:scale-[0.98]",
            )}
          >
            {question}
          </button>
        </li>
      ))}
    </ul>
  );
}
