"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "../Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#compare", label: "Compare" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * A floating pill rather than a full-width bar.
 *
 * The bar form pins a hairline across the top of every screenshot and makes the
 * page read as an app chrome; the pill leaves the hero's whitespace intact and
 * lets the product surface below it be the first solid object on the page.
 *
 * It is transparent over the top of the hero and gains its surface once the
 * page moves, so nothing sits over the headline until there is something to
 * sit over.
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
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="container-wide">
        <nav
          aria-label="Main"
          className={cn(
            // Aligned to the page's own measure rather than centred at some
            // narrower width, so its ends sit exactly over the content edges.
            "flex h-14 items-center justify-between gap-4 rounded-full pl-5 pr-2",
            "transition-all duration-300",
            scrolled
              // Opaque enough that a section heading scrolling under it stays
              // readable rather than showing through as a ghost.
              ? "border border-border bg-white/95 shadow-[var(--shadow-nav)] backdrop-blur-xl"
              : "border border-transparent bg-transparent",
          )}
        >
          <Link href="/" className="rounded-md text-[15px] text-ink">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-1">
            <ul className="hidden items-center gap-1 md:flex">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-3 py-2 text-[13.5px] text-muted transition-colors hover:bg-canvas hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* One action at every width. A hamburger over three anchor links
                would be chrome for its own sake. */}
            <Link
              href="/#ask"
              className="rounded-full bg-cobalt px-4 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-cobalt-deep"
            >
              Ask Predictly
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
