import Image from "next/image";
import type { BrandMarkRef } from "@/lib/categories";
import { cn } from "@/lib/utils";

/**
 * Renders a subject as an official asset when one has been cleared and dropped
 * into `/public/brands/`, and as its name set in type otherwise.
 *
 * The typographic form is not a placeholder — it is the permitted neutral
 * representation, and it is what ships until a mark's usage terms have actually
 * been checked. Dimensions are fixed either way so nothing shifts on load.
 */
export function BrandMark({
  mark,
  className,
}: {
  mark: BrandMarkRef;
  className?: string;
}) {
  if (mark.asset) {
    return (
      <Image
        src={mark.asset}
        alt={mark.name}
        width={160}
        height={40}
        loading="lazy"
        className={cn("h-[1em] w-auto object-contain", className)}
      />
    );
  }

  return (
    <span className={cn("inline-flex items-baseline gap-[0.18em] whitespace-nowrap", className)}>
      {mark.glyph ? (
        <span aria-hidden className="font-normal">
          {mark.glyph}
        </span>
      ) : null}
      {mark.name}
    </span>
  );
}
