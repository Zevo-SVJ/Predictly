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
  /** Base size. A `size-*` class in `className` overrides it at a breakpoint. */
  size?: number;
  className?: string;
}) {
  const asset = brandAsset(brand);
  const { Icon } = asset;

  return (
    <Icon
      size={asset.wide ? Math.round(size * 2.6) : size}
      color={asset.ink ? "var(--color-ink)" : asset.hex}
      className={cn("shrink-0", className)}
      aria-hidden
    />
  );
}

/**
 * Two badge shapes, because two kinds of mark exist.
 *
 * A symbol sits in a circle. A long wordmark forced into the same circle has to
 * shrink until it is a smear — McLaren and The Guardian are six times wider
 * than they are tall — so those get a pill, wider than it is tall, and draw at
 * a size that actually fills it. Same height either way, so a row or an orbit
 * still lines up.
 *
 * Sizes are responsive within one element rather than two elements swapped by
 * `hidden`/`inline-flex`: those are both display utilities, so which one wins
 * depends on stylesheet order rather than on the class list, and both badges
 * ended up painting.
 */
const ORB_SIZES = {
  sm: {
    box: "h-11",
    circle: "w-11",
    pill: "w-[4.25rem]",
    logo: 16,
    logoClass: "",
  },
  md: {
    box: "h-11 sm:h-[3.25rem]",
    circle: "w-11 sm:w-[3.25rem]",
    pill: "w-[4.25rem] sm:w-[5.25rem]",
    logo: 16,
    logoClass: "sm:size-[23px]",
  },
  lg: {
    box: "h-14 sm:h-16",
    circle: "w-14 sm:w-16",
    pill: "w-[5.5rem] sm:w-[6.5rem]",
    logo: 22,
    logoClass: "sm:size-[27px]",
  },
} as const;

/** Wide marks need the same multiplier applied to their breakpoint override. */
const WIDE_LOGO_CLASS: Record<keyof typeof ORB_SIZES, string> = {
  sm: "",
  md: "sm:size-[60px]",
  lg: "sm:size-[70px]",
};

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
  const logoClass = asset.wide ? WIDE_LOGO_CLASS[size] : config.logoClass;

  return (
    <span className={cn("inline-flex flex-col items-center gap-2", className)}>
      <span
        className={cn(
          "animate-orb-in flex items-center justify-center overflow-hidden rounded-full border border-border bg-white",
          config.box,
          asset.wide ? config.pill : config.circle,
        )}
        style={{
          boxShadow: `0 6px 18px -8px ${tint}, 0 1px 2px rgba(11,18,32,0.05)`,
          animationDelay: `${delayMs}ms`,
        }}
      >
        <BrandLogo brand={brand} size={config.logo} className={logoClass} />
      </span>
      {label ? <span className="text-[11.5px] text-muted">{label}</span> : null}
    </span>
  );
}
