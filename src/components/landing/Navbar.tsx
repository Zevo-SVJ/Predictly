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
  const [open, setOpen] = useState(false);
  const menuId = useId();

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
    <header className="fixed inset-x-0 top-0 z-50 pt-5 sm:pt-6">
      <div className="container-page">
        {/* A container from the first frame, not one that materialises on
            scroll: it should read as an object floating above the page. */}
        <nav
          aria-label="Main"
          className={cn(
            "relative flex h-[4.25rem] items-center justify-between gap-3 rounded-[2rem] p-2.5 sm:pl-6",
            // Fully opaque: a translucent pill lets a 7rem headline figure
            // ghost through it as the page scrolls past.
            "border border-border bg-white shadow-[var(--shadow-nav)]",
          )}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="flex size-12 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:bg-canvas md:hidden"
          >
            {open ? <X className="size-[22px]" aria-hidden /> : <Menu className="size-[22px]" aria-hidden />}
          </button>

          {/* Centred on a phone, flush left once the links appear beside it. */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 rounded-md text-[16px] text-ink md:static md:translate-x-0"
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
            className="flex size-12 items-center justify-center rounded-full bg-cobalt text-white transition-colors hover:bg-cobalt-deep md:size-auto md:px-5 md:py-3"
          >
            <span className="hidden text-[13.5px] font-medium md:inline">Make a prediction</span>
            <ArrowRight className="size-[18px] md:hidden" aria-hidden />
          </Link>
        </nav>

        {open ? (
          <div
            id={menuId}
            className="mt-3 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white p-3 shadow-[var(--shadow-nav)] md:hidden"
          >
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center rounded-[var(--radius-sm)] px-5 text-[17px] text-ink transition-colors hover:bg-canvas"
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
