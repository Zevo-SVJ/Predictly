import { Check, Loader2 } from "lucide-react";
import { STAGE_LABEL, STAGES, type Stage } from "@/lib/types";
import { cn } from "@/lib/utils";

const VISIBLE = STAGES.filter((stage) => stage !== "complete");

/**
 * What the pipeline is doing, right now.
 *
 * Every line corresponds to a stage the server has genuinely reached. It never
 * advances on a timer, so a fast forecast simply shows fewer intermediate
 * states rather than a progress bar padding out a wait that has already ended.
 */
export function ResearchProgress({
  stage,
  detail,
  className,
}: {
  stage: Stage;
  detail?: string;
  className?: string;
}) {
  const currentIndex = VISIBLE.indexOf(stage as (typeof VISIBLE)[number]);

  return (
    <ol className={cn("space-y-px", className)} aria-live="polite" aria-atomic="false">
      {VISIBLE.map((item, index) => {
        const done = currentIndex > index || stage === "complete";
        const active = currentIndex === index && stage !== "complete";

        return (
          <li
            key={item}
            className={cn(
              "flex items-center gap-3 py-2.5 text-[14px] transition-colors duration-300",
              done ? "text-muted" : active ? "font-medium text-ink" : "text-faint/60",
            )}
          >
            <span className="flex size-4 shrink-0 items-center justify-center">
              {done ? (
                <Check className="size-4 text-cobalt" aria-hidden />
              ) : active ? (
                <Loader2 className="size-4 animate-spin text-cobalt" aria-hidden />
              ) : (
                <span className="size-1.5 rounded-full bg-border-strong" aria-hidden />
              )}
            </span>

            <span className="min-w-0 flex-1 truncate">{STAGE_LABEL[item]}</span>

            {active && detail ? (
              <span className="max-w-[45%] shrink-0 truncate font-mono text-[11px] text-faint">
                {detail}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
