"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Category discovery as an editorial wall, not a row of filter pills.
 *
 * Each entry is set at heading scale and dims its neighbours on hover, so the
 * field responds as a whole rather than as a set of independent chips. Each one
 * carries a starter question, so clicking a category begins a real forecast
 * rather than dropping the visitor into an empty filtered view.
 */
const CATEGORIES: { label: string; question: string }[] = [
  { label: "Sport", question: "Who will win the 2026-27 UEFA Champions League?" },
  { label: "Tech", question: "Will Apple unveil its first foldable iPhone at its September 2026 event?" },
  { label: "Markets", question: "Will the US Federal Reserve cut interest rates at its September 2026 meeting?" },
  { label: "AI", question: "Will AI assistants account for more than 10% of web search referrals by the end of 2027?" },
  { label: "Crypto", question: "Will Bitcoin reach $100,000 before the end of 2026?" },
  { label: "Politics", question: "Which party will win the most seats at the next UK general election?" },
  { label: "Entertainment", question: "Which film will win Best Picture at the 2027 Academy Awards?" },
  { label: "Science", question: "Will a crewed Starship mission launch before the end of 2027?" },
  { label: "Gaming", question: "Will Grand Theft Auto VI release on its announced date?" },
  { label: "Business", question: "Will Nvidia end 2026 as the world's most valuable company?" },
];

export function CategoryWall() {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  return (
    <section className="section-y border-b border-line">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="font-semibold leading-[0.92]" style={{ fontSize: "var(--text-h2)" }}>
            Anything with a date on it.
          </h2>
          <p className="max-w-[34ch] text-[14.5px] leading-relaxed text-muted">
            If it resolves, it can be forecast. Start anywhere.
          </p>
        </div>

        <ul
          className="mt-12 flex flex-wrap items-baseline gap-x-7 gap-y-2 sm:mt-16 sm:gap-x-12"
          onMouseLeave={() => setHovered(null)}
        >
          {CATEGORIES.map((category) => (
            <li key={category.label}>
              <button
                type="button"
                onMouseEnter={() => setHovered(category.label)}
                onFocus={() => setHovered(category.label)}
                onBlur={() => setHovered(null)}
                onClick={() =>
                  router.push(`/predict?q=${encodeURIComponent(category.question)}`)
                }
                className={cn(
                  "font-semibold leading-[1.05] tracking-[-0.04em] transition-all duration-300",
                  hovered === null && "text-fg",
                  hovered === category.label && "text-lime",
                  hovered !== null && hovered !== category.label && "text-faint/50",
                )}
                style={{ fontSize: "var(--text-h2)" }}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
