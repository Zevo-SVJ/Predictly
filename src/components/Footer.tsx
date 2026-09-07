import Link from "next/link";
import { Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Wordmark className="text-[15px]" />
          <p className="text-sm leading-relaxed text-faint">
            Predictly estimates probabilities from public evidence. Forecasts are
            not certainties, and nothing here is financial, legal, medical or
            betting advice.
          </p>
        </div>

        <nav aria-label="Footer" className="flex gap-10 text-sm">
          <div className="space-y-2.5">
            <p className="text-xs uppercase tracking-widest text-faint">Product</p>
            <Link href="/predict" className="block text-muted hover:text-fg">
              Make a prediction
            </Link>
            <Link href="/history" className="block text-muted hover:text-fg">
              My predictions
            </Link>
            <Link href="/#how-it-works" className="block text-muted hover:text-fg">
              How it works
            </Link>
          </div>
          <div className="space-y-2.5">
            <p className="text-xs uppercase tracking-widest text-faint">Account</p>
            <Link href="/login" className="block text-muted hover:text-fg">
              Sign in
            </Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-faint sm:px-6">
          © {new Date().getFullYear()} Predictly. Free for everyone during the launch period.
        </p>
      </div>
    </footer>
  );
}
