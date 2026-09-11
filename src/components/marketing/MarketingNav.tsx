"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Wordmark } from "../Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#examples", label: "Examples" },
  { href: "/#compare", label: "Compare" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * A floating pill, present from the first frame rather than materialising on
 * scroll — it should read as an object above the page, not as page chrome.
 *
 * Mobile and desktop are different compositions rather than one layout with
 * pieces hidden: a phone gets the wordmark and a single menu button, which is a
 * shape a thumb can use; above `md` the links and both actions come out.
 */
export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Escape closes the sheet, and the page behind it does not scroll while it is
  // open — on a phone that scroll-through is the difference between a sheet and
  // a bug.
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
        <nav
          aria-label="Main"
          className={cn(
            "relative flex h-[4.25rem] items-center justify-between gap-3 rounded-[2rem] py-2.5 pl-6 pr-2.5",
            // Opaque: a translucent pill lets a 7rem headline figure ghost
            // through it as the page scrolls past.
            "border border-border bg-white shadow-[var(--shadow-nav)]",
          )}
        >
          <Link href="/" className="rounded-md text-[16px] text-ink">
            <Wordmark />
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
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

          <div className="flex items-center gap-1.5">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-3 text-[13.5px] text-muted transition-colors hover:bg-canvas hover:text-ink md:block"
            >
              Log in
            </Link>
            <Link
              href="/predict"
              className="hidden rounded-full bg-cobalt px-5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-cobalt-deep md:block"
            >
              Make a prediction
            </Link>

            <button
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
              className="flex size-12 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:bg-canvas md:hidden"
            >
              {open ? (
                <X className="size-[22px]" aria-hidden />
              ) : (
                <Menu className="size-[22px]" aria-hidden />
              )}
            </button>
          </div>
        </nav>

        {open ? (
          <div
            id={menuId}
            className="mt-3 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white p-3 shadow-[var(--shadow-nav)] md:hidden"
          >
            <ul>
              {[...LINKS, { href: "/login", label: "Log in" }].map((link) => (
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
            <Link
              href="/predict"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-14 items-center justify-center rounded-[var(--radius-sm)] bg-cobalt px-5 text-[16px] font-semibold text-white"
            >
              Make a prediction
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
