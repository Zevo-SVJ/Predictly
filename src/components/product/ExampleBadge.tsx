import { cn } from "@/lib/utils";

/**
 * The stamp on every piece of demo content.
 *
 * Placed on the product surface itself rather than in a footnote, because a
 * visitor screenshotting a forecast card should carry the label with it. Any
 * component rendering something from `lib/demo` is expected to show this.
 */
export function ExampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-canvas px-2.5 py-1",
        "font-mono text-[10px] uppercase tracking-[0.12em] text-muted",
        className,
      )}
    >
      <span className="size-1 rounded-full bg-border-strong" aria-hidden />
      Example forecast
    </span>
  );
}

/**
 * The sentence that has to accompany a demo source list.
 *
 * Real outlets appear in the example rows, so this states plainly that nothing
 * has been researched and no one is being quoted.
 */
export function ExampleDisclosure({ className }: { className?: string }) {
  return (
    <p className={cn("text-[12px] leading-relaxed text-muted", className)}>
      Illustrative product interface. Predictly has not researched this question
      and no source is being quoted — each row describes what an outlet covers,
      not what it published.
    </p>
  );
}
