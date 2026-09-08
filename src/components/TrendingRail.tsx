"use client";

import {
  Bitcoin,
  Flag,
  Goal,
  type LucideIcon,
  ShieldHalf,
  Smartphone,
  Sparkles,
  Trophy,
  Volleyball,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import type { TrendingEvent, TrendingIconKey } from "@/lib/trending";
import { cn } from "@/lib/utils";

/** One icon per subject: a trophy for the Ballon d'Or, a flag for F1, and so on. */
const ICONS: Record<TrendingIconKey, LucideIcon> = {
  trophy: Trophy,
  smartphone: Smartphone,
  football: Goal,
  racing: Flag,
  tennis: Volleyball,
  bitcoin: Bitcoin,
  sparkles: Sparkles,
  shield: ShieldHalf,
};

interface TrendingRailProps {
  events: TrendingEvent[];
  direction: "left" | "right";
  /** Seconds for one full pass. Slow reads as deliberate, not busy. */
  durationSeconds?: number;
}

/**
 * A continuously moving rail of open questions.
 *
 * The track holds two copies of the list and translates by exactly -50%, so the
 * loop is seamless. Hover and keyboard focus pause it; `prefers-reduced-motion`
 * turns it into an ordinary scrollable list (see globals.css).
 */
export function TrendingRail({ events, direction, durationSeconds = 120 }: TrendingRailProps) {
  if (events.length === 0) return null;

  return (
    <div className="rail-mask relative w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul
        className={cn(
          "rail-track flex w-max gap-3 py-1.5",
          direction === "left" ? "animate-rail-left" : "animate-rail-right",
        )}
        style={{ ["--rail-duration" as string]: `${durationSeconds}s` }}
      >
        {[...events, ...events].map((event, index) => (
          <TrendingEventPill
            key={`${event.id}-${index}`}
            event={event}
            // The second copy exists only to make the loop seamless.
            duplicate={index >= events.length}
          />
        ))}
      </ul>
    </div>
  );
}

function TrendingEventPill({ event, duplicate }: { event: TrendingEvent; duplicate: boolean }) {
  const Icon = ICONS[event.icon];
  const router = useRouter();

  return (
    <li aria-hidden={duplicate || undefined}>
      <button
        type="button"
        tabIndex={duplicate ? -1 : undefined}
        onClick={() => {
          track("trending_event_clicked", { id: event.id, category: event.category });
          // Carries the exact question into the prediction input.
          router.push(`/predict?q=${encodeURIComponent(event.question)}&from=${event.id}`);
        }}
        className={cn(
          "group flex items-center gap-3 whitespace-nowrap rounded-full border border-line",
          "bg-surface/80 py-2.5 pl-3 pr-5 text-left transition-all duration-300",
          "hover:-translate-y-px hover:border-lime/30 hover:bg-elevated",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated text-faint transition-colors duration-300 group-hover:bg-lime/10 group-hover:text-lime">
          <Icon className="size-[15px]" aria-hidden />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[13.5px] font-medium leading-none text-fg">
            {event.shortTitle}
          </span>
          <span className="text-[10.5px] uppercase leading-none tracking-[0.14em] text-faint">
            {event.category}
          </span>
        </span>
      </button>
    </li>
  );
}
