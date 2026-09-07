import Link from "next/link";
import { Wordmark } from "./Logo";

/**
 * Deliberately sparse: two links and one CTA. The navbar's job is to get out of
 * the way of the hero.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className="rounded-md text-[15px] text-fg">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#worth-predicting"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg sm:block"
          >
            Trending
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg sm:block"
          >
            How it works
          </Link>
          <Link
            href="/predict"
            className="rounded-full bg-lime px-4 py-1.5 text-sm font-medium text-lime-ink transition-colors hover:bg-lime-dim"
          >
            Make a prediction
          </Link>
        </div>
      </nav>
    </header>
  );
}
