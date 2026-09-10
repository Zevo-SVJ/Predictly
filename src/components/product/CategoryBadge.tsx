import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

/** The domain a forecast sits in. Quiet by design — it is metadata, not a claim. */
export function CategoryBadge({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-white px-2.5 py-1",
        "text-[11px] font-medium text-muted",
        className,
      )}
    >
      {category}
    </span>
  );
}
