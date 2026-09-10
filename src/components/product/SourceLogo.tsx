import {
  SiApple,
  SiArstechnica,
  SiCnn,
  SiDazn,
  SiF1,
  SiMclaren,
  SiNewyorktimes,
  SiRedbull,
  SiTechcrunch,
  SiTheguardian,
} from "@icons-pack/react-simple-icons";
import type { BrandKey } from "@/lib/demo";
import { cn } from "@/lib/utils";

/**
 * A real brand mark, from Simple Icons.
 *
 * Named imports only, so the bundle carries the twelve marks this page uses
 * rather than the six thousand in the package. Nothing here is hand-drawn: an
 * approximation of a protected mark would be both a worse logo and a
 * misrepresentation of it.
 *
 * Marks render monochrome by default. A page that shows a source list in five
 * different brand colours reads as a logo wall; keeping them in ink keeps the
 * emphasis on the evidence and lets cobalt stay the only colour that means
 * something. `tone="brand"` is reserved for the outcome rows, where the colour
 * is how you tell two cars apart at a glance.
 */
/**
 * `wide` marks are long wordmarks. Simple Icons normalises every path into a
 * 24×24 box, so a mark that is six times wider than it is tall ends up only a
 * few pixels high at an icon size that suits a square symbol — legible for
 * Apple, invisible for McLaren. Wide marks are therefore drawn at roughly twice
 * the nominal size inside the same tile, where the spare vertical room in their
 * own viewBox absorbs it.
 */
const MARKS: Record<BrandKey, { Icon: typeof SiApple; label: string; wide?: boolean }> = {
  apple: { Icon: SiApple, label: "Apple" },
  f1: { Icon: SiF1, label: "Formula 1", wide: true },
  mclaren: { Icon: SiMclaren, label: "McLaren", wide: true },
  redbull: { Icon: SiRedbull, label: "Red Bull" },
  guardian: { Icon: SiTheguardian, label: "The Guardian", wide: true },
  nyt: { Icon: SiNewyorktimes, label: "The New York Times" },
  cnn: { Icon: SiCnn, label: "CNN", wide: true },
  arstechnica: { Icon: SiArstechnica, label: "Ars Technica" },
  techcrunch: { Icon: SiTechcrunch, label: "TechCrunch", wide: true },
  dazn: { Icon: SiDazn, label: "DAZN" },
};

export function SourceLogo({
  brand,
  tone = "ink",
  size = 16,
  className,
}: {
  brand: BrandKey;
  tone?: "ink" | "brand";
  /** Nominal size for a square symbol. Wide wordmarks scale up from it. */
  size?: number;
  className?: string;
}) {
  const mark = MARKS[brand];
  const { Icon } = mark;

  return (
    <Icon
      size={mark.wide ? Math.round(size * 1.9) : size}
      // `color="default"` is Simple Icons' own brand hex; anything else
      // inherits, so the tile's text colour drives the monochrome case.
      {...(tone === "brand" ? { color: "default" as const } : {})}
      className={cn("shrink-0", className)}
      // No `title`: Simple Icons renders it as an <svg><title>, and every mark
      // on this page already sits next to its name in visible text. Keeping it
      // would scatter duplicate <title> elements through the document for no
      // accessibility gain, since the mark itself is decorative here.
      aria-hidden
    />
  );
}

/** The mark inside a bordered tile — the form used in source and outcome rows. */
export function SourceLogoTile({
  brand,
  tone = "ink",
  className,
}: {
  brand: BrandKey;
  tone?: "ink" | "brand";
  className?: string;
}) {
  return (
    <span
      className={cn(
        // Wider than tall, and the same width for every brand, so a wordmark
        // has room to be read and a column of tiles still lines up.
        "flex h-9 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border border-border bg-white text-ink",
        className,
      )}
    >
      <SourceLogo brand={brand} tone={tone} size={18} />
    </span>
  );
}

export function brandLabel(brand: BrandKey): string {
  return MARKS[brand].label;
}
