import { CircleSlash, ShieldCheck, XCircle } from "lucide-react";
import { EvidenceList } from "./EvidenceList";
import { SignalList } from "./SignalList";
import { CategoryBadge } from "./product/CategoryBadge";
import { ConfidenceIndicator } from "./product/ConfidenceIndicator";
import { EventMeta } from "./product/EventMeta";
import { OutcomeRow } from "./product/OutcomeRow";
import { ProbabilityValue } from "./product/ProbabilityValue";
import { deriveSignals } from "@/lib/forecast/signals";
import type { ForecastResult as Forecast } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

/**
 * A live forecast, rendered through the same components the landing page's
 * examples use.
 *
 * That shared vocabulary is the point: a visitor who was persuaded by the
 * example card in the hero sees the identical object when their own question
 * comes back, rather than a second, differently designed surface.
 *
 * Reading order is the argument, in the order a sceptic would demand it: the
 * question, the number, the distribution, which way each pressure points, why
 * in words, then the sources it all rests on.
 */
export function ForecastResult({
  forecast,
  className,
}: {
  forecast: Forecast;
  className?: string;
}) {
  const signals = deriveSignals(forecast);
  const ordered = [...forecast.outcomes].sort((a, b) => b.probability - a.probability);
  const headline = ordered[0];
  const researched = formatDate(forecast.researchedAt);
  const eventDate = formatDate(forecast.eventDate);

  return (
    <article className={cn("space-y-10 sm:space-y-14", className)}>
      {forecast.resolutionStatus !== "unresolved" ? <ResolutionNotice forecast={forecast} /> : null}

      {/* ---- question + the number ------------------------------------- */}
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
        <div className="min-w-0">
          <CategoryBadge category={forecast.category} />
          <h1 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[36px] lg:text-[42px]">
            {forecast.question}
          </h1>
          <EventMeta
            horizon={eventDate ? `Resolves ${eventDate}` : "No fixed date"}
            outcomes={forecast.outcomes.length}
            sources={forecast.evidence.length}
            className="mt-4"
          />
        </div>

        {headline ? (
          <div>
            <p className="eyebrow">Forecast</p>
            <ProbabilityValue
              probability={headline.probability}
              size="lg"
              verdict={forecast.outcomes.length === 2}
              className="mt-2"
            />
            <p className="mt-3 text-[18px] font-medium text-ink sm:text-xl">{headline.label}</p>
            <ConfidenceIndicator confidence={forecast.confidence} className="mt-4" />
          </div>
        ) : null}
      </header>

      {/* ---- the full distribution -------------------------------------- */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-white px-5 py-1 shadow-[var(--shadow-card)] sm:px-6">
        <h2 className="sr-only">Every outcome</h2>
        <ul>
          {ordered.map((outcome, index) => (
            <OutcomeRow
              key={outcome.id}
              label={outcome.label}
              probability={outcome.probability}
              leading={index === 0}
              className={index > 0 ? "border-t border-border/70" : undefined}
            />
          ))}
        </ul>
      </section>

      {/* ---- reasoning | evidence --------------------------------------- */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0 space-y-10">
          {signals.length > 0 ? (
            <section>
              <h2 className="eyebrow">Signals</h2>
              <SignalList signals={signals} className="mt-4" />
            </section>
          ) : null}

          <section>
            <h2 className="text-lg font-semibold">Why?</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{forecast.reasoning}</p>

            {signals.length > 0 ? (
              <ol className="mt-5 space-y-3">
                {signals.map((signal, index) => (
                  <li key={signal.id} className="flex gap-3 text-[14px] leading-relaxed">
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={
                          signal.direction === "up" ? "text-supports" : "text-counters"
                        }
                        aria-hidden
                      >
                        {signal.direction === "up" ? "↑ " : "↓ "}
                      </span>
                      <span className="text-muted">{signal.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}

            <p className="mt-6 border-l-2 border-border pl-4 text-[13.5px] leading-relaxed text-faint">
              {forecast.normalizedEvent}
            </p>
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold">Sources</h2>
            <span className="text-[12.5px] text-faint">Researched {researched ?? "—"}</span>
          </div>

          <p className="text-[13px] leading-relaxed text-faint">
            Confidence describes the forecast, not the event: it reflects how
            much usable, recent, agreeing evidence Predictly found.
          </p>

          <EvidenceList evidence={forecast.evidence} />
        </div>
      </div>

      <footer className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-border bg-canvas p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
        <p className="text-xs leading-relaxed text-muted">
          A probability estimate from public evidence, not a statement about what
          will happen. Predictly does not give financial, legal, medical or
          betting advice, and takes no bets.
        </p>
      </footer>
    </article>
  );
}

function ResolutionNotice({ forecast }: { forecast: Forecast }) {
  const resolved = forecast.outcomes.find((o) => o.id === forecast.resolvedOutcomeId);
  const config = {
    correct: {
      icon: ShieldCheck,
      tone: "text-supports border-supports/30 bg-supports-soft",
      label: "Resolved correct",
    },
    wrong: {
      icon: XCircle,
      tone: "text-counters border-counters/30 bg-counters-soft",
      label: "Resolved wrong",
    },
    cancelled: { icon: CircleSlash, tone: "text-muted border-border bg-canvas", label: "Cancelled" },
  }[forecast.resolutionStatus as "correct" | "wrong" | "cancelled"];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className={cn("flex items-start gap-3 rounded-[var(--radius-md)] border p-4", config.tone)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="text-sm leading-relaxed">
        <p className="font-medium">{config.label}</p>
        <p className="mt-1 text-muted">
          {resolved ? `Actual outcome: ${resolved.label}. ` : ""}
          {forecast.resolvedAt ? `Recorded ${formatDate(forecast.resolvedAt)}.` : ""}{" "}
          {forecast.resolutionSource ? (
            <a
              href={forecast.resolutionSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cobalt underline underline-offset-2"
            >
              Source
            </a>
          ) : null}
        </p>
      </div>
    </div>
  );
}
