"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Wordmark } from "../Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/predict", label: "Predict" },
  { href: "/#trending", label: "Trending" },
  { href: "/#how-it-works", label: "How it works" },
];

/**
 * A floating pill, not a full-width bar.
 *
 * A bar pins a hairline across the top of every screenshot and makes the page
 * read as app chrome. The pill leaves the hero's whitespace intact and lets the
 * forecast card below be the first solid object on the page.
 *
 * Mobile and desktop are different compositions rather than one layout with
 * things hidden: on a phone the wordmark is centred between a menu button and a
 * single round action, which is a shape a thumb can use; above `md` the links
 * come out of the sheet and sit inline.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the sheet, and the page behind it does not scroll while it
  // is open — on a phone that scroll-through is the difference between a sheet
  // and a bug.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="container-page">
        <nav
          aria-label="Main"
          className={cn(
            "relative flex h-14 items-center justify-between gap-3 rounded-full pl-2 pr-2 transition-all duration-300 sm:pl-5",
            scrolled || open
              ? "border border-border bg-white/95 shadow-[var(--shadow-nav)] backdrop-blur-xl"
              : "border border-transparent",
          )}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas md:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>

          {/* Centred on a phone, flush left once the links appear beside it. */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 rounded-md text-[15px] text-ink md:static md:translate-x-0"
          >
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-[13.5px] text-muted transition-colors hover:bg-canvas hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/predict"
            aria-label="Make a prediction"
            className="flex size-10 items-center justify-center rounded-full bg-cobalt text-white transition-colors hover:bg-cobalt-deep md:size-auto md:px-4 md:py-2.5"
          >
            <span className="hidden text-[13.5px] font-medium md:inline">Make a prediction</span>
            <ArrowRight className="size-[18px] md:hidden" aria-hidden />
          </Link>
        </nav>

        {open ? (
          <div
            id={menuId}
            className="mt-2 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-white p-2 shadow-[var(--shadow-nav)] md:hidden"
          >
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-[var(--radius-md)] px-4 text-[16px] text-ink transition-colors hover:bg-canvas"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
