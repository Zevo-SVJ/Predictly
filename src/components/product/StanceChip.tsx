import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { Stance } from "@/lib/types";
import { cn } from "@/lib/utils";

const STANCES = {
  supports: { label: "Supports", icon: TrendingUp, className: "text-supports bg-supports-soft" },
  opposes: { label: "Counters", icon: TrendingDown, className: "text-counters bg-counters-soft" },
  neutral: { label: "Context", icon: Minus, className: "text-muted bg-canvas" },
} as const;

/**
 * Which way a source pushes the forecast.
 *
 * Icon plus word, never colour on its own: the direction has to survive a
 * greyscale screenshot and a red-green colour deficiency, both of which are
 * common enough on a page whose whole purpose is to be screenshotted.
 */
export function StanceChip({ stance, className }: { stance: Stance; className?: string }) {
  const config = STANCES[stance];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        config.className,
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {config.label}
    </span>
  );
}
