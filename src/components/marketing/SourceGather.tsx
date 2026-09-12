import { LogoOrb } from "./BrandLogo";
import type { BrandKey } from "./brandAssets";
import { cn } from "@/lib/utils";

/**
 * The question, and the sources gathering under it.
 *
 * Three shapes were tried here. A full orbit needs width a portrait card does
 * not have — the radius collapses and the badges stop being recognisable. An
 * arc fixes the height but only holds compact discs, and most news marks are
 * wordmarks, which have to be pills. This holds both: two staggered rows,
 * widest first, so a pill and a disc sit together without either being forced
 * into the other's shape.
 *
 * The dashed drop from the question is what makes it a composition rather than
 * a logo grid — the sources are visibly attached to the thing being asked.
 */
export function SourceGather({
  question,
  rows,
  className,
}: {
  question: string;
  /** Badges per row, laid out centred. Two rows reads best. */
  rows: BrandKey[][];
  className?: string;
}) {
  // Flattened up front rather than counted during render: mutating a closure
  // variable while mapping is the kind of thing that silently desynchronises
  // the stagger the moment React renders the tree twice.
  const offsets = rows.reduce<number[]>(
    (acc, row, i) => [...acc, (acc[i] ?? 0) + row.length],
    [0],
  );

  return (
    <div className={cn("flex w-full flex-col items-center", className)}>
      <div className="animate-rise-in w-[11.5rem] rounded-[var(--radius-md)] border border-border bg-white px-4 py-4 text-center shadow-[var(--shadow-card)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cobalt">
          Your question
        </p>
        <p className="mt-2 text-[13.5px] font-semibold leading-snug tracking-[-0.015em] text-ink">
          {question}
        </p>
      </div>

      <span className="my-4 block h-8 w-px border-l border-dashed border-border-strong" aria-hidden />

      <p className="label mb-4">Reading {rows.flat().length} sources</p>

      <div className="flex w-full flex-col items-center gap-3">
        {rows.map((row, rowIndex) => (
          <ul key={rowIndex} className="flex flex-wrap items-center justify-center gap-3">
            {row.map((brand, position) => (
              <li key={brand}>
                <LogoOrb
                  brand={brand}
                  size="md"
                  delayMs={260 + ((offsets[rowIndex] ?? 0) + position) * 80}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
