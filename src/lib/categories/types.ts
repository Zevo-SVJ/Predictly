/**
 * The domains Predictly forecasts.
 *
 * The category is the headline. Marks underneath are visual evidence of that
 * domain's breadth — never the subject of the forecast themselves. "Sports" is
 * the thing you can predict; the Champions League is one example inside it.
 */
export type PredictionCategoryId =
  | "sports"
  | "technology"
  | "politics"
  | "entertainment"
  | "business"
  | "science"
  | "gaming"
  | "crypto"
  | "culture";

/**
 * A recognisable mark used as supporting visual evidence for a category.
 *
 * `asset` is intentionally optional. Where a trademark owner's guidelines
 * permit the use, drop the official file into `/public/brands/` and set this
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
  /** Placement inside the category's cluster: % of the cluster box. */
  x: number;
  y: number;
  scale: "sm" | "md" | "lg";
}

export interface PredictionCategory {
  id: PredictionCategoryId;
  name: string;
  /** One concise line about what this domain covers. */
  description: string;
  /** A representative question, used for the category's Predict action. */
  question: string;
  marks: BrandMarkRef[];
}
