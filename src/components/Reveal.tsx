"use client";

import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll-linked entrance.
 *
 * `MotionConfig reducedMotion="user"` makes Motion itself honour
 * `prefers-reduced-motion`, so there is no render-time branch on a media query
 * and therefore no server/client hydration mismatch. `initial` is identical on
 * both, and content revealed this way is always decorative framing — never the
 * only path to information.
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
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        // Paired with the <noscript> rule in the root layout: without
        // JavaScript these elements would otherwise stay at opacity 0 forever.
        data-reveal
        className={className}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
