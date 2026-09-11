import { LogoOrb } from "./BrandLogo";
import type { BrandKey } from "./brandAssets";
import { cn } from "@/lib/utils";

/**
 * A question with its sources around it.
 *
 * Two flanking rows rather than a scattered ring: a ring has to be positioned
 * absolutely, and at 340px the discs start colliding with the question and with
 * each other. Rows give the same "surrounded by evidence" reading and simply
 * cannot break.
 *
 * The orbs stagger in from top-left, quickly — the whole cluster lands in under
 * a second, which reads as research arriving rather than as an animation.
 */
export function SourceCluster({
  question,
  above,
  below,
  className,
}: {
  question: string;
  above: BrandKey[];
  below: BrandKey[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-3">
        {above.map((brand, index) => (
          <li key={brand}>
            <LogoOrb brand={brand} size="md" delayMs={index * 70} />
          </li>
        ))}
      </ul>

      <p className="max-w-[17rem] rounded-[var(--radius-md)] border border-border bg-white px-5 py-4 text-center text-[15px] font-medium leading-snug text-ink shadow-[var(--shadow-object)]">
        {question}
      </p>

      <ul className="flex flex-wrap items-center justify-center gap-3">
        {below.map((brand, index) => (
          <li key={brand}>
            <LogoOrb brand={brand} size="md" delayMs={(above.length + index) * 70} />
          </li>
        ))}
      </ul>
    </div>
  );
}
