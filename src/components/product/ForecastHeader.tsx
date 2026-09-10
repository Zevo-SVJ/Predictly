import { CategoryBadge } from "./CategoryBadge";
import { EventMeta } from "./EventMeta";
import { ExampleBadge } from "./ExampleBadge";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The top of any forecast surface: what was asked, and the frame around it.
 *
 * The question is set at heading weight rather than as a caption, because it is
 * the thing the number below is an answer to. Losing it turns a forecast into a
 * floating percentage.
 */
export function ForecastHeader({
  question,
  category,
  horizon,
  outcomes,
  sources,
  example = false,
  size = "md",
  as: Heading = "h2",
  className,
}: {
  question: string;
  category: Category;
  horizon: string;
  outcomes: number;
  sources: number;
  example?: boolean;
  size?: "sm" | "md";
  /** Where this card sits in the document outline. */
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <header className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={category} />
        {example ? <ExampleBadge /> : null}
      </div>

      <Heading
        className={cn(
          "font-semibold leading-[1.15] tracking-[-0.03em] text-ink",
          size === "sm" ? "text-[17px] sm:text-[19px]" : "text-[20px] sm:text-[26px]",
        )}
      >
        {question}
      </Heading>

      <EventMeta horizon={horizon} outcomes={outcomes} sources={sources} />
    </header>
  );
}
