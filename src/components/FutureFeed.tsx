import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPredictionStore } from "@/lib/store";
import { getTrendingEvents } from "@/lib/trending";
import type { ForecastResult } from "@/lib/types";
import { formatDate, formatPercent, slugify } from "@/lib/utils";

/**
 * Discovery feed — the questions worth predicting.
 *
 * Magazine composition rather than a card grid: one oversized lead question,
 * then a dense ruled list. Every row is a link straight into the forecasting
 * flow.
 *
 * The forecast column shows a REAL probability when Predictly has already run
 * that question, and says "Not yet forecast" when it hasn't. It never displays
 * an invented number to make the section look populated — which also means this
 * feed fills in on its own as the product gets used.
 */
export async function FutureFeed() {
  const events = getTrendingEvents();
  const store = await getPredictionStore();

  // A miss here is not an error: an empty database simply means no row has a
  // forecast yet, which the UI states plainly.
  let existing = new Map<string, ForecastResult>();
  try {
    existing = await store.findLatestBySlugs(events.map((event) => slugify(event.question)));
  } catch (error) {
    console.error("Feed forecast lookup failed:", error);
  }

  const rows = events.map((event) => ({
    event,
    forecast: existing.get(slugify(event.question)) ?? null,
  }));

  const [lead, ...rest] = rows;
  if (!lead) return null;

  return (
    <section id="explore" className="scroll-mt-20 section-y border-b border-line">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2
            className="max-w-[15ch] font-semibold leading-[0.92]"
            style={{ fontSize: "var(--text-h2)" }}
          >
            What&apos;s worth predicting?
          </h2>
          <p className="max-w-[34ch] text-[14.5px] leading-relaxed text-muted">
            Open questions with a date attached and a real answer coming. Pick
            one and Predictly goes and finds out.
          </p>
        </div>

        {/* Lead item, set at display scale so the section opens with weight. */}
        <Link
          href={`/predict?q=${encodeURIComponent(lead.event.question)}&from=${lead.event.id}`}
          className="group mt-14 block border-t border-line pt-8 sm:mt-20"
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-lime">
              {lead.event.topic}
            </span>
            <span className="eyebrow">{lead.event.category}</span>
            {lead.event.eventDate ? (
              <span className="eyebrow">{formatDate(lead.event.eventDate)}</span>
            ) : null}
          </div>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <h3
              className="max-w-[18ch] font-semibold leading-[0.95] transition-colors duration-300 group-hover:text-lime"
              style={{ fontSize: "var(--text-h1)" }}
            >
              {lead.event.question}
            </h3>
            <ForecastCell forecast={lead.forecast} large />
          </div>
        </Link>

        <ul className="mt-4">
          {rest.map((row, index) => (
            <li key={row.event.id}>
              <Link
                href={`/predict?q=${encodeURIComponent(row.event.question)}&from=${row.event.id}`}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 border-t border-line py-6 transition-[padding] duration-300 hover:pl-2 sm:grid-cols-[3rem_1fr_9rem_auto] sm:gap-x-8 sm:py-7"
              >
                <span className="font-mono text-[11px] tabular-nums text-faint">
                  {String(index + 2).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span
                    className="block font-medium leading-snug transition-colors duration-300 group-hover:text-lime"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {row.event.question}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-lime/70">
                      {row.event.topic}
                    </span>
                    <span className="eyebrow">{row.event.category}</span>
                    <span className="eyebrow sm:hidden">
                      {formatDate(row.event.eventDate) ?? "Date open"}
                    </span>
                  </span>
                </span>

                <span className="hidden text-[13px] text-muted sm:block">
                  {formatDate(row.event.eventDate) ?? "Date open"}
                </span>

                <span className="col-start-2 mt-3 flex items-center gap-4 sm:col-start-4 sm:mt-0">
                  <ForecastCell forecast={row.forecast} />
                  <ArrowUpRight
                    className="size-4 shrink-0 text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * The forecast column. Shows a real number, or says there isn't one — the one
 * place on this page where it would be easiest to fake data, and doesn't.
 */
function ForecastCell({ forecast, large = false }: { forecast: ForecastResult | null; large?: boolean }) {
  if (!forecast) {
    return (
      <span
        className={
          large
            ? "block whitespace-nowrap text-[13px] text-faint"
            : "whitespace-nowrap text-[13px] text-faint"
        }
      >
        Not yet forecast
      </span>
    );
  }

  return (
    <span className={large ? "block" : "flex items-baseline gap-2.5"}>
      <span
        className={
          large
            ? "block font-semibold leading-none tabular-nums text-lime"
            : "font-semibold tabular-nums text-lime"
        }
        style={large ? { fontSize: "var(--text-figure)" } : { fontSize: "1.35rem" }}
      >
        {formatPercent(forecast.probability)}
      </span>
      <span
        className={
          large
            ? "mt-3 block text-[13px] uppercase tracking-[0.14em] text-muted"
            : "text-[12px] text-muted"
        }
      >
        {forecast.outcome}
      </span>
    </span>
  );
}
