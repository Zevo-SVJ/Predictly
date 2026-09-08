import Link from "next/link";
import { Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer>
      <div className="container-wide flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs space-y-3">
          <Wordmark className="text-[15px]" />
          <p className="text-[13px] leading-relaxed text-faint">
            Forecast the future. Predictly estimates probabilities from public
            evidence — not certainties, and not financial, legal, medical or
            betting advice.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-12 gap-y-2 text-[13.5px]">
          <Link href="/predict" className="text-muted transition-colors hover:text-fg">
            Predict
          </Link>
          <Link href="/history" className="text-muted transition-colors hover:text-fg">
            History
          </Link>
          <Link href="/#explore" className="text-muted transition-colors hover:text-fg">
            Explore
          </Link>
          <Link href="/login" className="text-muted transition-colors hover:text-fg">
            Sign in
          </Link>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="container-wide py-4 text-[12px] text-faint">
          © {new Date().getFullYear()} Predictly. Free for everyone during the launch period.
        </p>
      </div>
    </footer>
  );
}
