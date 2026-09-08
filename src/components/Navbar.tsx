"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import { cn } from "@/lib/utils";

/**
 * Transparent over the hero, gaining a hairline and a backdrop once the page
 * moves. Two links and one action — no pill container, no badge.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-line bg-ink/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="container-wide flex h-16 items-center justify-between sm:h-20"
      >
        <Link href="/" className="rounded-md text-[15px] text-fg">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-2 sm:gap-8">
          <Link
            href="/#explore"
            className="hidden text-[13.5px] text-muted transition-colors hover:text-fg sm:block"
          >
            Explore
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden text-[13.5px] text-muted transition-colors hover:text-fg sm:block"
          >
            How it works
          </Link>
          <Link
            href="/predict"
            className="rounded-full border border-line-strong px-4 py-2 text-[13.5px] font-medium text-fg transition-all duration-200 hover:border-lime/40 hover:bg-lime/[0.07] hover:text-lime active:scale-[0.97]"
          >
            Ask Predictly
          </Link>
        </div>
      </nav>
    </header>
  );
}
