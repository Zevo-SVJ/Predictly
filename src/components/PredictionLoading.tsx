import { Check, Loader2 } from "lucide-react";
import { STAGE_LABEL, STAGES, type Stage } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Research progress.
 *
 * Every line corresponds to a stage the server has actually reached — the
 * component renders what the stream reports and never advances on a timer, so
 * a fast forecast simply shows fewer intermediate states.
 */
export function PredictionLoading({
  question,
  stage,
  detail,
}: {
  question: string;
  stage: Stage;
  detail?: string;
}) {
  const visible = STAGES.filter((s) => s !== "done");
  const currentIndex = visible.indexOf(stage as (typeof visible)[number]);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-faint">Researching</p>
      <h1 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">{question}</h1>

      <ol className="mt-10 space-y-1" aria-live="polite" aria-atomic="false">
        {visible.map((item, index) => {
          const done = currentIndex > index || stage === "done";
          const active = currentIndex === index && stage !== "done";
          if (!done && !active) {
            return (
              <li key={item} className="flex items-center gap-3 py-2 text-sm text-faint/60">
                <span className="size-4 shrink-0" aria-hidden />
                {STAGE_LABEL[item]}
              </li>
            );
          }

          return (
            <li
              key={item}
              className={cn(
                "animate-slide-in flex items-center gap-3 py-2 text-sm",
                active ? "text-fg" : "text-muted",
              )}
            >
              {done ? (
                <Check className="size-4 shrink-0 text-lime" aria-hidden />
              ) : (
                <Loader2 className="size-4 shrink-0 animate-spin text-lime" aria-hidden />
              )}
              <span>{STAGE_LABEL[item]}</span>
              {active && detail ? (
                <span className="truncate text-xs text-faint">— {detail}</span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="mt-10 text-xs leading-relaxed text-faint">
        Predictly reads the sources it finds, judges each one, then aggregates
        them into a probability. This usually takes under a minute.
      </p>
    </div>
  );
}
