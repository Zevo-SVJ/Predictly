import Link from "next/link";
import { Wordmark } from "../Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Wordmark className="text-[15px]" />
          <p className="mt-2 text-[13px] text-faint">Predict what happens next.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2 text-[13.5px]">
          <Link href="/predict" className="inline-flex min-h-9 items-center text-muted transition-colors hover:text-ink">
            Predict
          </Link>
          <Link href="/#how-it-works" className="inline-flex min-h-9 items-center text-muted transition-colors hover:text-ink">
            How it works
          </Link>
          <Link href="/history" className="inline-flex min-h-9 items-center text-muted transition-colors hover:text-ink">
            History
          </Link>
          <Link href="/#faq" className="inline-flex min-h-9 items-center text-muted transition-colors hover:text-ink">
            FAQ
          </Link>
        </nav>
      </div>

      <div className="border-t border-border">
        <p className="container-page py-4 text-[12px] leading-relaxed text-faint">
          Predictly estimates probabilities from public evidence. Forecasts are
          not certainties, and nothing here is financial, legal, medical or
          betting advice. Brand marks shown in example forecasts are the
          trademarks of their respective owners and are used to identify
          publications and organisations, not to imply any endorsement.
        </p>
      </div>
    </footer>
  );
}
