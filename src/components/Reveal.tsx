"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-linked entrance.
 *
 * Deliberately not built on an animation library: this is two transitioned
 * properties behind an IntersectionObserver, which a 42 KB dependency was
 * previously doing for a single section. The observer toggles a data attribute
 * directly on the node rather than setting React state, so revealing costs no
 * re-render.
 *
 * The hidden state, the transition and the reduced-motion opt-out all live in
 * `globals.css` under `[data-reveal]`, alongside the `<noscript>` rule in the
 * root layout that forces these visible when scripting is off.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Without the API, show immediately rather than leave content hidden.
    if (typeof IntersectionObserver === "undefined") {
      element.dataset.shown = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        element.dataset.shown = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal className={className} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
