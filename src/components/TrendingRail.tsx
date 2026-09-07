"use client";

import {
  Award,
  Bitcoin,
  ChartNoAxesCombined,
  Clapperboard,
  Cpu,
  Flag,
  Gamepad2,
  Globe,
  Landmark,
  Music4,
  Percent,
  Rocket,
  Smartphone,
  Thermometer,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import type { TrendingEvent, TrendingIconKey } from "@/lib/data/trending";
import { cn } from "@/lib/utils";

/** Icon per subject — a controller for games, a chequered flag for F1, and so on. */
const ICONS: Record<TrendingIconKey, LucideIcon> = {
  gamepad: Gamepad2,
  trophy: Trophy,
  bitcoin: Bitcoin,
  smartphone: Smartphone,
  flag: Flag,
  landmark: Landmark,
  award: Award,
  rocket: Rocket,
  percent: Percent,
  clapperboard: Clapperboard,
  thermometer: Thermometer,
  chart: ChartNoAxesCombined,
  cpu: Cpu,
  music: Music4,
  globe: Globe,
};

interface TrendingRailProps {
  events: TrendingEvent[];
  direction: "left" | "right";
  /** Seconds for one full pass. Slower reads as calmer and more deliberate. */
  durationSeconds?: number;
}

/**
 * Continuously moving rail of open questions.
 *
 * The track holds two copies of the list and translates by exactly -50%, so the
 * loop is seamless. Hover and keyboard focus pause it; `prefers-reduced-motion`
 * turns the whole thing into an ordinary scrollable list (see globals.css).
 */
export function TrendingRail({ events, direction, durationSeconds = 72 }: TrendingRailProps) {
  return (
    <div className="rail-mask relative w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul
        className={cn(
          "rail-track flex w-max gap-2.5 py-1",
          direction === "left" ? "animate-rail-left" : "animate-rail-right",
        )}
        style={{ ["--rail-duration" as string]: `${durationSeconds}s` }}
      >
        {[...events, ...events].map((event, index) => (
          <TrendingEventPill
            key={`${event.id}-${index}`}
            event={event}
            // The second copy exists only to make the loop seamless.
            ariaHidden={index >= events.length}
          />
        ))}
      </ul>
    </div>
  );
}

function TrendingEventPill({
  event,
  ariaHidden,
}: {
  event: TrendingEvent;
  ariaHidden: boolean;
}) {
  const Icon = ICONS[event.icon];
  const router = useRouter();

  return (
    <li aria-hidden={ariaHidden || undefined}>
      <button
        type="button"
        tabIndex={ariaHidden ? -1 : undefined}
        onClick={() => {
          track("trending_event_clicked", { id: event.id, category: event.category });
          router.push(`/predict?q=${encodeURIComponent(event.question)}&from=${event.id}`);
        }}
        className="group flex items-center gap-3 rounded-full border border-line bg-surface/90 py-2 pl-3 pr-4 text-left transition-colors hover:border-line-strong hover:bg-elevated"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated text-muted transition-colors group-hover:text-lime">
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="flex flex-col">
          <span className="whitespace-nowrap text-[13.5px] font-medium leading-tight text-fg">
            {event.question}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-faint">{event.category}</span>
        </span>
      </button>
    </li>
  );
}
