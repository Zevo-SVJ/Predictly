"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { track } from "@/lib/analytics";
import { CATEGORIES, FIELD_PLACEMENT, MARKS, findMark } from "@/lib/categories";
import { cn } from "@/lib/utils";

/**
 * "What can you predict?" — breadth shown as one composition rather than a list.
 *
 * Desktop is a constellation of subjects at four type scales, hand-placed into
 * an asymmetric field. Activating one dims the rest and reveals its category
 * and a single example question. Only ever one example on screen.
 *
 * Mobile is not this layout shrunk: it is a scroll-snap strip driven by the
 * thumb, one subject at a time, with no hover anywhere in the interaction.
 */
const SCALE_CLASS = {
  sm: "text-[clamp(0.95rem,1.4vw,1.25rem)]",
  md: "text-[clamp(1.15rem,2vw,1.75rem)]",
  lg: "text-[clamp(1.5rem,2.8vw,2.5rem)]",
  xl: "text-[clamp(1.9rem,3.8vw,3.4rem)]",
} as const;

/**
 * Resting brightness by scale, so the field has depth before anything is
 * active — a single flat dim value made the whole section read washed out.
 */
const REST_CLASS = {
  sm: "text-faint/55",
  md: "text-muted/60",
  lg: "text-muted/80",
  xl: "text-fg/70",
} as const;

export function PredictField() {
  const [activeId, setActiveId] = useState<string>(FIELD_PLACEMENT[0]?.markId ?? "");
  const router = useRouter();

  const start = useCallback(
    (markId: string) => {
      const mark = findMark(markId);
      if (!mark) return;
      track("trending_event_clicked", { id: mark.id, category: "category-field" });
      router.push(`/predict?q=${encodeURIComponent(mark.question)}&from=${mark.id}`);
    },
    [router],
  );

  return (
    <section id="explore" className="scroll-mt-20 section-y border-t border-line">
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="min-w-0">
            <h2
              className="font-semibold leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: "var(--text-h1)" }}
            >
              What can you
              <br />
              predict?
            </h2>
            <p className="mt-6 max-w-[38ch] text-[15px] leading-relaxed text-muted">
              From the next big launch to the next champion, Predictly follows
              the signals behind what happens next.
            </p>

            {/* Desktop detail panel. Reserved height so activating a mark never
                shifts the layout. */}
            <div className="mt-10 hidden min-h-[9.5rem] lg:block">
              <ActiveDetail activeId={activeId} onStart={start} />
            </div>
          </div>

          {/* ---------------------------------------------------- desktop field */}
          <div
            className="group/field relative hidden aspect-[16/11] w-full lg:block"
            onMouseLeave={() => setActiveId(FIELD_PLACEMENT[0]?.markId ?? "")}
          >
            <ConnectingLine activeId={activeId} />
            {FIELD_PLACEMENT.map((placement) => {
              const mark = findMark(placement.markId);
              if (!mark) return null;
              const active = activeId === placement.markId;

              return (
                <button
                  key={placement.markId}
                  type="button"
                  onMouseEnter={() => setActiveId(placement.markId)}
                  onFocus={() => setActiveId(placement.markId)}
                  onClick={() => start(placement.markId)}
                  aria-label={`${mark.name} — ${mark.categoryName}. Forecast: ${mark.question}`}
                  className={cn(
                    "absolute font-semibold tracking-[-0.03em] transition-all duration-500",
                    SCALE_CLASS[placement.scale],
                    "group-hover/field:opacity-40 hover:!opacity-100",
                    active && "opacity-100 group-hover/field:opacity-100",
                    active ? "text-fg" : REST_CLASS[placement.scale],
                  )}
                  style={{ left: `${placement.x}%`, top: `${placement.y}%` }}
                >
                  <BrandMark mark={mark} />
                </button>
              );
            })}
          </div>

          {/* ----------------------------------------------------- mobile strip */}
          <MobileStrip activeId={activeId} setActiveId={setActiveId} onStart={start} />
        </div>
      </div>
    </section>
  );
}

function ActiveDetail({
  activeId,
  onStart,
}: {
  activeId: string;
  onStart: (id: string) => void;
}) {
  const mark = findMark(activeId);
  if (!mark) return null;

  return (
    <div key={mark.id} className="animate-rise-in">
      <p className="eyebrow">{mark.categoryName}</p>
      <p className="mt-3 max-w-[34ch] text-[17px] leading-snug text-fg">{mark.question}</p>
      <button
        type="button"
        onClick={() => onStart(mark.id)}
        className="group mt-5 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13.5px] font-medium text-fg transition-colors duration-200 hover:border-lime/40 hover:bg-lime/[0.07] hover:text-lime"
      >
        Predict it
        <ArrowRight
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden
        />
      </button>
    </div>
  );
}

/** A hairline from the copy column to the active mark, drawn only on desktop. */
function ConnectingLine({ activeId }: { activeId: string }) {
  const placement = FIELD_PLACEMENT.find((entry) => entry.markId === activeId);
  if (!placement) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <line
        x1="0"
        y1={`${placement.y + 3}%`}
        x2={`${placement.x}%`}
        y2={`${placement.y + 3}%`}
        stroke="var(--color-lime)"
        strokeOpacity="0.3"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
    </svg>
  );
}

/**
 * Mobile: native horizontal scroll-snap. The thumb drives it, an observer
 * reports which subject is centred, and only that one is ever shown expanded.
 */
function MobileStrip({
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
        const id = (centred?.target as HTMLElement | undefined)?.dataset.markId;
        if (id) setActiveId(id);
      },
      { root, threshold: 0.6 },
    );

    for (const child of root.children) observer.observe(child);
    return () => observer.disconnect();
  }, [setActiveId]);

  const active = findMark(activeId);

  return (
    <div className="min-w-0 lg:hidden">
      <ul
        ref={scroller}
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MARKS.map((mark) => (
          <li key={mark.id} data-mark-id={mark.id} className="snap-center">
            <button
              type="button"
              onClick={() => onStart(mark.id)}
              aria-label={`${mark.name} — ${mark.categoryName}. Forecast: ${mark.question}`}
              className={cn(
                "flex h-24 min-w-[13rem] items-center justify-center rounded-2xl border px-6 text-center",
                "text-[1.5rem] font-semibold tracking-[-0.03em] transition-colors duration-300",
                activeId === mark.id
                  ? "border-lime/30 bg-elevated text-fg"
                  : "border-line bg-surface text-faint",
              )}
            >
              <BrandMark mark={mark} />
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div key={active.id} className="animate-rise-in mt-7">
          <p className="eyebrow">{active.categoryName}</p>
          <p className="mt-2.5 text-[16px] leading-snug text-fg">{active.question}</p>
          <button
            type="button"
            onClick={() => onStart(active.id)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-[14px] font-medium text-lime-ink transition-colors duration-200 active:scale-[0.97]"
          >
            Predict it
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </div>
      ) : null}

      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5" aria-hidden>
        {CATEGORIES.map((category) => (
          <li key={category.id} className="eyebrow">
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
