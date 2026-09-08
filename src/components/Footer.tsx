import Link from "next/link";
import { Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Wordmark className="text-[15px]" />
          <p className="text-[13px] leading-relaxed text-faint">
            Predictly estimates probabilities from public evidence. Forecasts
            are not certainties, and nothing here is financial, legal, medical
            or betting advice.
          </p>
        </div>

        <nav aria-label="Footer" className="flex gap-12 text-[13.5px]">
          <div className="space-y-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Product</p>
            <Link href="/predict" className="block text-muted transition-colors hover:text-fg">
              Make a prediction
            </Link>
            <Link href="/#trending" className="block text-muted transition-colors hover:text-fg">
              Trending
            </Link>
            <Link href="/#how-it-works" className="block text-muted transition-colors hover:text-fg">
              How it works
            </Link>
          </div>
          <div className="space-y-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-faint">Account</p>
            <Link href="/history" className="block text-muted transition-colors hover:text-fg">
              My predictions
            </Link>
            <Link href="/login" className="block text-muted transition-colors hover:text-fg">
              Sign in
            </Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-4 text-[12px] text-faint sm:px-8">
          © {new Date().getFullYear()} Predictly. Free for everyone during the launch period.
        </p>
      </div>
    </footer>
  );
}
