import type { Signal } from "@/lib/forecast/signals";
import { cn } from "@/lib/utils";

/**
 * The compressed reading of the forecast.
 *
 * This is the part that survives a screenshot: six lines that say which way
 * each pressure points and how hard. Each label is a three-word compression of
 * a factor the reasoning step produced — the sentence it came from is carried
 * in `aria-label` here and printed in full in the "Why?" list directly below,
 * so the compression can never be the only version a reader sees.
 */
export function SignalList({ signals, className }: { signals: Signal[]; className?: string }) {
  if (signals.length === 0) return null;

  return (
    <ul className={cn("space-y-2.5", className)}>
      {signals.map((signal) => {
        const up = signal.direction === "up";
        return (
          <li key={signal.id} className="flex items-center gap-3" aria-label={signal.detail}>
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded text-[13px] font-semibold",
                up ? "bg-supports-soft text-supports" : "bg-counters-soft text-counters",
              )}
              aria-hidden
            >
              {up ? "↑" : "↓"}
            </span>

            <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink sm:text-[12.5px]">
              {signal.label}
            </span>

            <span className="flex h-1 w-16 shrink-0 overflow-hidden rounded-full bg-canvas sm:w-24">
              <span
                className={cn("animate-bar-fill block h-full rounded-full", up ? "bg-supports" : "bg-counters")}
                style={{ width: `${Math.round(signal.weight * 100)}%` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
