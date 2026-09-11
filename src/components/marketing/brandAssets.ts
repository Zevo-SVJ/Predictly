import {
  SiApple,
  SiArstechnica,
  SiBitcoin,
  SiCnn,
  SiDazn,
  SiF1,
  SiFifa,
  SiGoogle,
  SiImdb,
  SiInstagram,
  SiMclaren,
  SiNetflix,
  SiNewyorktimes,
  SiNvidia,
  SiRedbull,
  SiSpacex,
  SiTechcrunch,
  SiTheguardian,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";

/**
 * Every brand mark the marketing page is allowed to draw, in one place.
 *
 * Real SVGs from Simple Icons, never hand-drawn: an approximation of a
 * protected mark is both a worse logo and a misrepresentation of it. Named
 * imports only, so the bundle carries these twenty rather than the six thousand
 * in the package.
 *
 * `hex` is the brand's own colour, and marks render in it — a page of
 * monochrome logos loses the one thing real logos are for. Two exceptions are
 * flagged rather than special-cased at each call site:
 *
 * - `ink: true` for marks whose own colour is black or near-white. Black reads
 *   as "not coloured in"; near-white (DAZN) is invisible on a white disc. Both
 *   render in the page's ink instead.
 * - `wide: true` for long wordmarks. Simple Icons normalises every path into a
 *   24×24 box, so a mark six times wider than it is tall ends up a few pixels
 *   high at a size that suits a square symbol. Wide marks draw at roughly twice
 *   the nominal size, where the spare vertical room in their own viewBox
 *   absorbs it.
 *
 * Not available in Simple Icons, and therefore deliberately absent rather than
 * faked: Reuters, Bloomberg, BBC, ESPN, LinkedIn.
 */
export interface BrandAsset {
  Icon: typeof SiApple;
  label: string;
  /** The brand's own colour, used for the mark and for its soft cast shadow. */
  hex: string;
  /** Draw in page ink: the brand colour is black or too pale to see. */
  ink?: boolean;
  /** A long wordmark, which needs roughly double the nominal size to read. */
  wide?: boolean;
}

export const BRAND_ASSETS = {
  apple: { Icon: SiApple, label: "Apple", hex: "#000000", ink: true },
  google: { Icon: SiGoogle, label: "Google", hex: "#4285F4" },
  youtube: { Icon: SiYoutube, label: "YouTube", hex: "#FF0000" },
  instagram: { Icon: SiInstagram, label: "Instagram", hex: "#FF0069" },
  x: { Icon: SiX, label: "X", hex: "#000000", ink: true },
  netflix: { Icon: SiNetflix, label: "Netflix", hex: "#E50914", wide: true },
  guardian: { Icon: SiTheguardian, label: "The Guardian", hex: "#052962", wide: true },
  nyt: { Icon: SiNewyorktimes, label: "The New York Times", hex: "#000000", ink: true },
  cnn: { Icon: SiCnn, label: "CNN", hex: "#CC0000", wide: true },
  arstechnica: { Icon: SiArstechnica, label: "Ars Technica", hex: "#FF4E00" },
  techcrunch: { Icon: SiTechcrunch, label: "TechCrunch", hex: "#029F00", wide: true },
  dazn: { Icon: SiDazn, label: "DAZN", hex: "#F8F8F5", ink: true },
  f1: { Icon: SiF1, label: "Formula 1", hex: "#E10600", wide: true },
  mclaren: { Icon: SiMclaren, label: "McLaren", hex: "#FF8000", wide: true },
  redbull: { Icon: SiRedbull, label: "Red Bull", hex: "#DB0A40" },
  fifa: { Icon: SiFifa, label: "FIFA", hex: "#326295" },
  nvidia: { Icon: SiNvidia, label: "NVIDIA", hex: "#76B900", wide: true },
  spacex: { Icon: SiSpacex, label: "SpaceX", hex: "#000000", ink: true, wide: true },
  bitcoin: { Icon: SiBitcoin, label: "Bitcoin", hex: "#F7931A" },
  imdb: { Icon: SiImdb, label: "IMDb", hex: "#F5C518", wide: true },
} as const satisfies Record<string, BrandAsset>;

export type BrandKey = keyof typeof BRAND_ASSETS;

export function brandAsset(brand: BrandKey): BrandAsset {
  return BRAND_ASSETS[brand];
}
