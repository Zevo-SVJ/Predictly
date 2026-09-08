"use client";

import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import type { TrendingEvent } from "@/lib/trending";
import { cn } from "@/lib/utils";

/**
 * An editorial ticker, not a card rail.
 *
 * Topic in lime, question in body text, hairline separators — the visual
 * language of a newswire crawl rather than a row of rounded boxes. Two copies
 * of the list translate by exactly -50% for a seamless loop; hover and keyboard
 * focus pause it, and `prefers-reduced-motion` turns it into a plain
 * horizontally scrollable list.
 */
export function TrendingTicker({
  events,
  direction,
  durationSeconds = 130,
}: {
  events: TrendingEvent[];
  direction: "left" | "right";
  durationSeconds?: number;
}) {
  const router = useRouter();
  if (events.length === 0) return null;

  return (
    <div className="rail-mask relative w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul
        className={cn(
          "rail-track flex w-max items-stretch",
          direction === "left" ? "animate-rail-left" : "animate-rail-right",
        )}
        style={{ ["--rail-duration" as string]: `${durationSeconds}s` }}
      >
        {[...events, ...events].map((event, index) => {
          const duplicate = index >= events.length;
          return (
            <li key={`${event.id}-${index}`} aria-hidden={duplicate || undefined}>
              <button
                type="button"
                tabIndex={duplicate ? -1 : undefined}
                aria-label={`${event.topic}: ${event.question}`}
                onClick={() => {
                  track("trending_event_clicked", { id: event.id, category: event.category });
                  router.push(`/predict?q=${encodeURIComponent(event.question)}&from=${event.id}`);
                }}
                title={event.question}
                className="group flex h-full items-center whitespace-nowrap border-r border-line px-8 py-4 transition-colors duration-300 hover:bg-surface"
              >
                {/* Topic only. The full questions live in the input and the
                    category field; repeating them here is the third time a
                    visitor reads the same list. */}
                <span className="text-[15px] font-medium uppercase tracking-[0.14em] text-muted transition-colors duration-300 group-hover:text-lime">
                  {event.topic}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
