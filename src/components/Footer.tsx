import Link from "next/link";
import { Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-wide flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Wordmark className="text-[15px]" />
          <p className="mt-2 text-[13px] text-faint">Forecast what happens next.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2 text-[13.5px]">
          <Link href="/predict" className="text-muted transition-colors hover:text-fg">
            Predict
          </Link>
          <Link href="/#explore" className="text-muted transition-colors hover:text-fg">
            Explore
          </Link>
          <Link href="/history" className="text-muted transition-colors hover:text-fg">
            History
          </Link>
          <Link href="/login" className="text-muted transition-colors hover:text-fg">
            Sign in
          </Link>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="container-wide py-4 text-[12px] leading-relaxed text-faint">
          Predictly estimates probabilities from public evidence. Forecasts are
          not certainties, and nothing here is financial, legal, medical or
          betting advice.
        </p>
      </div>
    </footer>
  );
}
