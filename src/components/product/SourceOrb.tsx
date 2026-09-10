import { SourceLogo } from "./SourceLogo";
import type { BrandKey } from "@/lib/demo";
import { cn } from "@/lib/utils";

/**
 * A brand mark presented as an object rather than as an icon.
 *
 * White disc, hairline border, the same near-invisible shadow every surface on
 * the page uses. At this size a logo stops being decoration in a row of
 * decorations and becomes a thing on the page — which is the whole reason the
 * evidence reads as real.
 */
const SIZES = {
  sm: { box: "size-11", logo: 18 },
  md: { box: "size-14", logo: 22 },
  lg: { box: "size-16 sm:size-[4.5rem]", logo: 30 },
} as const;

export function SourceOrb({
  brand,
  size = "md",
  label,
  className,
}: {
  brand: BrandKey;
  size?: keyof typeof SIZES;
  /** Rendered under the disc when the name should travel with the mark. */
  label?: string;
  className?: string;
}) {
  const config = SIZES[size];

  return (
    <span className={cn("inline-flex flex-col items-center gap-2", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-full border border-border bg-white text-ink",
          "shadow-[var(--shadow-object)]",
          config.box,
        )}
      >
        <SourceLogo brand={brand} size={config.logo} />
      </span>
      {label ? <span className="text-[11.5px] text-muted">{label}</span> : null}
    </span>
  );
}
