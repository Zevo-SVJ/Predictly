import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { getPredictionStore } from "@/lib/store";
import { getTrendingEvents } from "@/lib/trending";
import type { ForecastResult } from "@/lib/types";
import { formatDate, formatPercent, slugify } from "@/lib/utils";

/**
 * Discover — Predictly as somewhere to browse, not only somewhere to type.
 *
 * The forecast column shows a REAL probability when Predictly has already run
 * that question and says so plainly when it hasn't, so the section fills in on
 * its own as the product gets used. It never displays an invented number to
 * look populated.
 */
export async function Discover() {
  const events = getTrendingEvents().slice(0, 6);
  const store = await getPredictionStore();

  // A miss is not an error: an empty database simply means nothing has been
  // forecast yet, which the rows state outright.
  let existing = new Map<string, ForecastResult>();
  try {
    existing = await store.findLatestBySlugs(events.map((event) => slugify(event.question)));
  } catch (error) {
    console.error("Discover lookup failed:", error);
  }

  return (
    <section id="discover" className="scroll-mt-20 border-t border-line py-16 sm:py-24">
      <div className="container-canvas">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <h2
              className="font-semibold leading-[0.92] tracking-[-0.045em]"
              style={{ fontSize: "var(--text-h2)" }}
            >
              What&apos;s being watched
            </h2>
            <p className="text-[14px] text-faint">
              Open questions with a date attached and a real answer coming.
            </p>
          </div>
        </Reveal>

        <ul className="mt-12">
          {events.map((event) => {
            const forecast = existing.get(slugify(event.question)) ?? null;
            return (
              <li key={event.id}>
                <Link
                  href={`/predict?q=${encodeURIComponent(event.question)}&from=${event.id}`}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-line py-6 transition-[padding] duration-300 hover:pl-2 sm:grid-cols-[8rem_1fr_8rem_auto] sm:py-7"
                >
                  <span className="order-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-lime/70 sm:order-1">
                    {event.topic}
                  </span>

                  <span className="order-1 min-w-0 text-[1.05rem] font-medium leading-snug transition-colors duration-300 group-hover:text-lime sm:order-2 sm:text-[1.15rem]">
                    {event.question}
                  </span>

                  <span className="order-3 hidden text-[13px] text-muted sm:block">
                    {formatDate(event.eventDate) ?? "Date open"}
                  </span>

                  <span className="order-4 flex items-center gap-3">
                    {forecast ? (
                      <span className="text-[1.15rem] font-semibold tabular-nums text-lime">
                        {formatPercent(forecast.probability)}
                      </span>
                    ) : (
                      <span className="whitespace-nowrap text-[12.5px] text-faint">
                        Not yet forecast
                      </span>
                    )}
                    <ArrowUpRight
                      className="size-4 shrink-0 text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="border-t border-line" aria-hidden />
        </ul>
      </div>
    </section>
  );
}
