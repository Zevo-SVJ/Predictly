import { LogoOrb } from "./BrandLogo";
import { brandAsset, type BrandKey } from "./brandAssets";
import { cn } from "@/lib/utils";

/**
 * The question, with its sources around it.
 *
 * This is the page's signature object, so it is built rather than arranged: the
 * badges sit on a real circle computed with trigonometry and positioned in
 * percentages of a square box, so the whole figure scales as one from 293px to
 * 480px without a single breakpoint.
 *
 * The angles are not decorative. Wordmark badges are pills — much wider than
 * they are tall — so they take the top and bottom, where only vertical
 * clearance from the centre card matters. The compact discs take the four
 * diagonals, where horizontal room is scarce. Laid out the other way round, the
 * pills collide with the question at 390px; that was measured, not guessed.
 */
/** The default set: the hero's F1 question. Callers may pass their own. */
export const F1_ORBIT: BrandKey[] = ["f1", "redbull", "ferrari", "guardian", "nyt", "dazn"];

/**
 * Places the badges around the circle, and it is not a decorative choice.
 *
 * Wordmark badges are pills — twice as wide as they are tall — so they need the
 * slots where only vertical clearance from the centre card matters: the top and
 * the bottom. Compact discs take the sides and diagonals, where horizontal room
 * is scarce. Placed the other way round the pills clip the question at 390px,
 * and in the small in-card orbit they clip it at every width.
 *
 * So rather than trusting the caller's array order, the angles are scored by
 * how vertical they are and handed to the wide marks first.
 */
function place(brands: BrandKey[]): { brand: BrandKey; angle: number }[] {
  const angles = brands.map((_, index) => -90 + (index * 360) / brands.length);
  const verticality = (angle: number) => Math.abs(Math.sin((angle * Math.PI) / 180));

  const byVertical = [...angles].sort((a, b) => verticality(b) - verticality(a));
  const wide = brands.filter((brand) => brandAsset(brand).wide);
  const narrow = brands.filter((brand) => !brandAsset(brand).wide);

  const assigned = new Map<BrandKey, number>();
  wide.forEach((brand, index) => assigned.set(brand, byVertical[index] ?? 0));
  const left = angles.filter((angle) => ![...assigned.values()].includes(angle));
  narrow.forEach((brand, index) => assigned.set(brand, left[index] ?? 0));

  // Rendered in angle order so the entrance stagger runs around the circle.
  return brands
    .map((brand) => ({ brand, angle: assigned.get(brand) ?? 0 }))
    .sort((a, b) => a.angle - b.angle);
}

/**
 * Radius as a share of the box width. 40% leaves a pill's half-width inside the
 * box at the narrowest viewport and still clears the centre card on the
 * diagonals.
 */
const RADIUS = 40;

function position(angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    left: `${50 + RADIUS * Math.cos(radians)}%`,
    top: `${50 + RADIUS * Math.sin(radians)}%`,
  };
}

export function LogoOrbit({
  question,
  brands = F1_ORBIT,
  size = "lg",
  className,
}: {
  question: string;
  brands?: BrandKey[];
  /** `sm` is the version that fits inside a feature card. */
  size?: "sm" | "lg";
  className?: string;
}) {
  const placed = place(brands);
  const large = size === "lg";

  return (
    <div
      data-orbit
      className={cn(
        "relative mx-auto aspect-square w-full",
        large ? "max-w-[19.5rem] sm:max-w-[25rem] lg:max-w-[29rem]" : "max-w-[19rem]",
        className,
      )}
    >
      {/* Two dashed rings and a soft cobalt wash at the centre. Drawn once, in
          one SVG, so there is no stack of nested bordered divs to keep aligned. */}
      <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="orbit-core">
            <stop offset="0%" stopColor="var(--color-cobalt)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="var(--color-cobalt)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="34" fill="url(#orbit-core)" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="0.35"
          strokeDasharray="1.2 2.2"
        />
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="0.35"
          strokeDasharray="1.2 2.2"
        />
      </svg>

      {/* The question is the centre of gravity: everything else is a satellite. */}
      <div
        data-orbit-core
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          large ? "w-[8.75rem] sm:w-[12rem] lg:w-[13.5rem]" : "w-[8rem]",
        )}
      >
        <div className="animate-rise-in rounded-[var(--radius-md)] border border-border bg-white px-4 py-4 text-center shadow-[var(--shadow-card)] sm:px-5 sm:py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cobalt">
            Your question
          </p>
          <p
            className={cn(
              "mt-2.5 font-semibold leading-snug tracking-[-0.015em] text-ink",
              large ? "text-[14px] sm:text-[15px]" : "text-[13px]",
            )}
          >
            {question}
          </p>
        </div>
      </div>

      <ul>
        {placed.map((item, index) => (
          <li
            key={item.brand}
            data-orbit-badge={item.brand}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={position(item.angle)}
          >
            <LogoOrb brand={item.brand} size={large ? "md" : "sm"} delayMs={220 + index * 80} />
          </li>
        ))}
      </ul>
    </div>
  );
}
