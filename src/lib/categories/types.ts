/**
 * The domains Predictly forecasts, and the recognisable subjects inside them.
 *
 * One central model so the "What can you predict?" field, its mobile variant
 * and any future discovery surface all read from the same place.
 */
export type PredictionCategoryId =
  | "sports"
  | "technology"
  | "ai"
  | "markets"
  | "entertainment"
  | "science";

/**
 * A recognisable subject used as a visual anchor.
 *
 * `asset` is intentionally optional. Where a third party's brand guidelines
 * permit the use, drop the official SVG into `/public/brands/` and set this
 * field — `BrandMark` renders it automatically. Until then the mark renders as
 * its name set in type, which is legally safe and needs no permission.
 *
 * Never point `asset` at a hand-drawn approximation of a protected logo.
 */
export interface BrandMarkRef {
  id: string;
  /** Display name. Doubles as the accessible label. */
  name: string;
  /** Path under /public, e.g. "/brands/example.svg". Omit if not cleared. */
  asset?: string;
  assetType?: "logo" | "wordmark" | "symbol";
  /** Where the asset came from, for licence review. */
  officialUrl?: string;
  /** A single glyph that is genuinely free to use, e.g. Bitcoin's ₿. */
  glyph?: string;
  /** The exact question loaded into the prediction input. */
  question: string;
}

export interface PredictionCategory {
  id: PredictionCategoryId;
  name: string;
  marks: BrandMarkRef[];
}

/** Placement in the desktop constellation. Hand-set for a controlled field. */
export interface MarkPlacement {
  markId: string;
  /** Percentage of the field, from its top-left. */
  x: number;
  y: number;
  /** Relative type size within the field. */
  scale: "sm" | "md" | "lg" | "xl";
}
