"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { track } from "@/lib/analytics";
import { CATEGORIES, findCategory, type PredictionCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

/**
 * "What can you predict?" — breadth as one composition.
 *
 * The CATEGORY is the headline; the marks beneath it are visual evidence of
 * that domain's range. Predictly forecasts sports, not the Champions League —
 * getting that hierarchy backwards made an earlier version read as though each
 * brand were a product feature.
 *
 * Desktop is a stacked list of category names where activating one brings its
 * cluster forward and recedes the rest. Mobile is not that shrunk: it is a
 * scroll-snap gallery, one category at a time, driven by the thumb with no
 * hover anywhere in the interaction.
 */
const MARK_SCALE = {
  sm: "text-[clamp(1.1rem,1.6vw,1.6rem)]",
  md: "text-[clamp(1.5rem,2.3vw,2.4rem)]",
  lg: "text-[clamp(2.1rem,3.4vw,3.4rem)]",
} as const;

export function PredictField() {
  const [activeId, setActiveId] = useState<string>(CATEGORIES[0]?.id ?? "");
  const router = useRouter();

  const start = useCallback(
    (categoryId: string) => {
      const category = findCategory(categoryId);
      if (!category) return;
      track("category_mark_selected", { id: category.id, category: category.name });
      router.push(`/predict?q=${encodeURIComponent(category.question)}&from=${category.id}`);
    },
    [router],
  );

  const active = findCategory(activeId) ?? CATEGORIES[0];

  // Fires once per category the visitor brings into focus, so we learn which
  // domains draw attention without tracking anything about the visitor.
  const seen = useRef(new Set<string>());
  const view = useCallback((categoryId: string) => {
    setActiveId(categoryId);
    if (seen.current.has(categoryId)) return;
    seen.current.add(categoryId);
    const category = findCategory(categoryId);
    if (category) track("category_viewed", { id: category.id, category: category.name });
  }, []);

  return (
    <section id="explore" className="scroll-mt-20 border-t border-line py-16 sm:py-24">
      <div className="container-canvas">
        {/* Mobile keeps the heading above; desktop moves it into the left
            column so the cluster can occupy the full height beside it. */}
        <div className="max-w-[46ch] lg:hidden">
          <p className="eyebrow">The range</p>
          <h2
            className="mt-4 font-semibold leading-[0.9] tracking-[-0.045em]"
            style={{ fontSize: "var(--text-h1)" }}
          >
            What can you predict?
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            Anything with an outcome and a date. Predictly follows the signals
            behind whichever future you&apos;re curious about.
          </p>
        </div>

        {/* -------------------------------------------------------- desktop */}
        <div
          className="hidden grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-16 lg:grid"
          onMouseLeave={() => setActiveId(CATEGORIES[0]?.id ?? "")}
        >
          <div>
            <p className="eyebrow">The range</p>
            <h2
              className="mt-4 max-w-[12ch] font-semibold leading-[0.9] tracking-[-0.045em]"
              style={{ fontSize: "var(--text-h1)" }}
            >
              What can you predict?
            </h2>
            <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-muted">
              Anything with an outcome and a date. Predictly follows the signals
              behind whichever future you&apos;re curious about.
            </p>

            <ul className="mt-12">
            {CATEGORIES.map((category) => {
              const isActive = category.id === activeId;
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onMouseEnter={() => view(category.id)}
                    onFocus={() => view(category.id)}
                    onClick={() => start(category.id)}
                    aria-label={`${category.name}. ${category.description} Forecast: ${category.question}`}
                    className={cn(
                      "block w-full border-t border-line py-3.5 text-left font-semibold leading-none",
                      "tracking-[-0.04em] transition-all duration-300",
                      isActive ? "text-fg" : "text-faint/60 hover:text-muted",
                    )}
                    style={{ fontSize: "var(--text-h2)" }}
                  >
                    {category.name}
                  </button>
                </li>
              );
            })}
              <li className="border-t border-line" aria-hidden />
            </ul>
          </div>

          {/* Cluster + detail for the active category only. */}
          {active ? (
            <div className="lg:sticky lg:top-28 lg:self-start">
              <MarkCluster category={active} />
              <div key={active.id} className="animate-rise-in mt-8 border-t border-line pt-7">
                <p className="max-w-[42ch] text-[15px] leading-relaxed text-muted">
                  {active.description}
                </p>
                <button
                  type="button"
                  onClick={() => start(active.id)}
                  className="group mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13.5px] font-medium text-fg transition-colors duration-200 hover:border-lime/40 hover:bg-lime/[0.07] hover:text-lime"
                >
                  Predict {active.name.toLowerCase()}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* --------------------------------------------------------- mobile */}
        <MobileGallery activeId={activeId} setActiveId={view} onStart={start} />
      </div>
    </section>
  );
}

/**
 * The supporting marks for one category, layered at three scales with
 * deliberate overlap so the group reads as a cluster rather than a row.
 */
function MarkCluster({ category }: { category: PredictionCategory }) {
  return (
    // Constrained so the marks pack into a cluster. Spread across the full
    // column they read as four stray words rather than a group.
    <div key={category.id} className="relative aspect-[4/3] w-full max-w-[34rem]">
      {category.marks.map((mark, index) => (
        <span
          key={mark.id}
          className={cn(
            "animate-rise-in absolute font-semibold tracking-[-0.02em] text-muted",
            MARK_SCALE[mark.scale],
            // Later marks sit behind earlier ones, giving the cluster depth.
            index === 0 ? "text-fg/80" : "text-muted/55",
          )}
          style={{
            left: `${mark.x}%`,
            top: `${mark.y}%`,
            animationDelay: `${index * 70}ms`,
          }}
        >
          <BrandMark mark={mark} />
        </span>
      ))}
    </div>
  );
}

/**
 * Mobile: native horizontal scroll-snap. The thumb drives it, an observer
 * reports which category is centred, and only that one is ever expanded.
 */
function MobileGallery({
  activeId,
  setActiveId,
  onStart,
}: {
  activeId: string;
  setActiveId: (id: string) => void;
  onStart: (id: string) => void;
}) {
  const scroller = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = scroller.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const centred = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (centred?.target as HTMLElement | undefined)?.dataset.categoryId;
        if (id) setActiveId(id);
      },
      { root, threshold: 0.6 },
    );

    for (const child of root.children) observer.observe(child);
    return () => observer.disconnect();
  }, [setActiveId]);

  const active = findCategory(activeId);

  return (
    <div className="mt-12 min-w-0 lg:hidden">
      <ul
        ref={scroller}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map((category) => {
          const isActive = category.id === activeId;
          return (
            <li key={category.id} data-category-id={category.id} className="snap-center">
              <button
                type="button"
                onClick={() => onStart(category.id)}
                aria-label={`${category.name}. ${category.description} Forecast: ${category.question}`}
                className={cn(
                  "flex h-52 w-[18rem] flex-col justify-between rounded-2xl border p-5 text-left transition-colors duration-300",
                  isActive ? "border-lime/30 bg-elevated" : "border-line bg-surface",
                )}
              >
                <span
                  className={cn(
                    "text-[1.9rem] font-semibold leading-none tracking-[-0.04em] transition-colors duration-300",
                    isActive ? "text-fg" : "text-faint",
                  )}
                >
                  {category.name}
                </span>

                {/* The cluster, flowed rather than absolutely placed — a phone
                    has no room for the layered desktop composition. */}
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {category.marks.map((mark, index) => (
                    <span
                      key={mark.id}
                      className={cn(
                        "text-[13px] font-medium transition-colors duration-300",
                        isActive && index === 0 ? "text-muted" : "text-faint/70",
                      )}
                    >
                      <BrandMark mark={mark} />
                    </span>
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {active ? (
        <div key={active.id} className="animate-rise-in mt-7">
          <p className="text-[15px] leading-relaxed text-muted">{active.description}</p>
          <button
            type="button"
            onClick={() => onStart(active.id)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-[14px] font-medium text-lime-ink transition-transform duration-200 active:scale-[0.97]"
          >
            Predict {active.name.toLowerCase()}
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
