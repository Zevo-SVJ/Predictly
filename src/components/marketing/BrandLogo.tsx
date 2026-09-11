import { brandAsset, type BrandKey } from "./brandAssets";
import { cn } from "@/lib/utils";

/**
 * A brand mark at its real size and in its real colour.
 *
 * Wordmarks are drawn larger than symbols for the reason explained in
 * `brandAssets.ts`, so callers pass one nominal size and get a mark that reads
 * at it either way.
 */
export function BrandLogo({
  brand,
  size = 22,
  className,
}: {
  brand: BrandKey;
  size?: number;
  className?: string;
}) {
  const asset = brandAsset(brand);
  const { Icon } = asset;

  return (
    <Icon
      size={asset.wide ? Math.round(size * 1.9) : size}
      color={asset.ink ? "var(--color-ink)" : asset.hex}
      className={cn("shrink-0", className)}
      aria-hidden
    />
  );
}

const ORB_SIZES = {
  sm: { box: "size-11", logo: 17 },
  md: { box: "size-[3.25rem]", logo: 21 },
  lg: { box: "size-[3.75rem] sm:size-16", logo: 25 },
} as const;

/**
 * The mark as a floating object: white disc, hairline border, and a soft cast
 * shadow tinted with the brand's own colour.
 *
 * That tint is the only place colour leaks onto the page outside the mark
 * itself, and it is what stops a row of discs reading as flat stickers. Kept at
 * low alpha — it should be felt rather than seen.
 */
export function LogoOrb({
  brand,
  size = "md",
  label,
  delayMs = 0,
  className,
}: {
  brand: BrandKey;
  size?: keyof typeof ORB_SIZES;
  /** Rendered under the disc when the name should travel with the mark. */
  label?: string;
  /** Stagger for the entrance, in milliseconds. */
  delayMs?: number;
  className?: string;
}) {
  const asset = brandAsset(brand);
  const config = ORB_SIZES[size];
  const tint = asset.ink ? "rgba(11,18,32,0.16)" : `${asset.hex}33`;

  return (
    <span className={cn("inline-flex flex-col items-center gap-2", className)}>
      <span
        className={cn(
          "animate-orb-in flex items-center justify-center rounded-full border border-border bg-white",
          config.box,
        )}
        style={{
          boxShadow: `0 6px 18px -8px ${tint}, 0 1px 2px rgba(11,18,32,0.05)`,
          animationDelay: `${delayMs}ms`,
        }}
      >
        <BrandLogo brand={brand} size={config.logo} />
      </span>
      {label ? <span className="text-[11.5px] text-muted">{label}</span> : null}
    </span>
  );
}
