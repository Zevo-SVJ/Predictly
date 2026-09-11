import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The three lines that open every section: a small cobalt label, one large
 * heading, one short line of grey.
 *
 * Always the same shape and always centred, because that repetition is what
 * makes the page's rhythm legible while scrolling — label, heading, object.
 */
export function SectionHeader({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-6 text-[length:var(--text-section)] font-semibold leading-[1.04] tracking-[-0.04em]">
        {title}
      </h2>
      {children ? (
        <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-muted">{children}</p>
      ) : null}
    </div>
  );
}
