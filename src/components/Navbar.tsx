"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import { cn } from "@/lib/utils";

/**
 * Minimal by design: two links and one action.
 *
 * The only scroll behaviour is a hairline and a background that fade in once
 * the page has moved, so the navbar disappears into the hero at rest and gains
 * just enough weight to stay legible over content.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link href="/" className="rounded-md text-[15px] text-fg">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-1 sm:gap-6">
          <Link
            href="/#trending"
            className="hidden rounded-md px-1 py-1 text-[13.5px] text-muted transition-colors hover:text-fg sm:block"
          >
            Trending
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden rounded-md px-1 py-1 text-[13.5px] text-muted transition-colors hover:text-fg sm:block"
          >
            How it works
          </Link>
          <Link
            href="/predict"
            className="rounded-full bg-lime px-4 py-2 text-[13.5px] font-medium text-lime-ink transition-all duration-200 hover:bg-lime-dim active:scale-[0.97]"
          >
            Make a prediction
          </Link>
        </div>
      </nav>
    </header>
  );
}
