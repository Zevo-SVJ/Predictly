import { CalendarDays, FileSearch, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The frame around a forecast: when it settles, how many outcomes it has, how
 * many sources it rests on.
 *
 * Wraps into a column on narrow screens instead of scrolling sideways, so none
 * of it is ever hidden behind an edge on a phone.
 */
export function EventMeta({
  horizon,
  outcomes,
  sources,
  className,
}: {
  horizon: string;
  outcomes: number;
  sources: number;
  className?: string;
}) {
  const items = [
    { icon: CalendarDays, label: horizon },
    { icon: Layers, label: `${outcomes} outcomes` },
    { icon: FileSearch, label: `${sources} sources` },
  ];

  return (
    <dl className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <dt className="sr-only">{item.label}</dt>
          <item.icon className="size-3.5 shrink-0 text-faint" aria-hidden />
          <dd className="text-[12.5px] text-muted">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}
