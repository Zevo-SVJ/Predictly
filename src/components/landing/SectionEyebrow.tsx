import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The small cobalt label above every major heading.
 *
 * It appears at the top of each scene and nowhere else, which is what makes the
 * page's rhythm legible while scrolling: label, heading, one line, one object.
 */
export function SectionEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}
