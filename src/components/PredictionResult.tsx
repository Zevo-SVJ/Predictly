import { CircleSlash, ShieldCheck, XCircle } from "lucide-react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { EvidenceList } from "./EvidenceList";
import { ForecastActions } from "./ForecastActions";
import { ForecastFactors } from "./ForecastFactors";
import { ProbabilityDisplay } from "./ProbabilityDisplay";
import type { ForecastResult } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * The forecast card — the most important surface in the product.
 *
 * Order is deliberate: the number, then what it means, then why, then the
 * evidence it rests on. Everything a sceptical reader needs is on one page.
 */
export function PredictionResult({
  forecast,
  showActions = true,
}: {
  forecast: ForecastResult;
  showActions?: boolean;
}) {
  const eventDate = formatDate(forecast.eventDate);
  const researchDate = formatDate(forecast.researchedAt);

  return (
    <article className="mx-auto max-w-3xl">
      {forecast.resolutionStatus !== "unresolved" ? (
        <ResolutionNotice forecast={forecast} />
      ) : null}

      <header className="space-y-5">
        <p className="text-xs uppercase tracking-widest text-faint">{forecast.category}</p>
        <h1 className="text-2xl font-semibold leading-tight sm:text-4xl">{forecast.question}</h1>
        <ProbabilityDisplay
          outcomes={forecast.outcomes}
          headlineOutcomeId={forecast.headlineOutcomeId}
        />
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wider text-faint">Event resolves</dt>
          <dd className="mt-1 text-fg">{eventDate ?? "Date not fixed"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-faint">Research completed</dt>
          <dd className="mt-1 text-fg">{researchDate}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-xs uppercase tracking-wider text-faint">Sources read</dt>
          <dd className="mt-1 text-fg">{forecast.evidence.length}</dd>
        </div>
      </dl>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Why Predictly thinks so</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{forecast.reasoning}</p>
        <p className="mt-4 text-sm leading-relaxed text-faint">
          {forecast.normalizedEvent}
        </p>
      </section>

      <section className="mt-10">
        <ForecastFactors up={forecast.factorsFor} down={forecast.factorsAgainst} />
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Evidence</h2>
          <ConfidenceBadge confidence={forecast.confidence} />
        </div>
        <p className="mt-2 text-sm text-faint">
          Confidence describes the forecast, not the event: it reflects how much
          usable, recent, agreeing evidence Predictly found.
        </p>
        <div className="mt-5">
          <EvidenceList evidence={forecast.evidence} />
        </div>
      </section>

      {showActions ? (
        <section className="mt-10">
          <ForecastActions forecast={forecast} />
        </section>
      ) : null}

      <footer className="mt-10 flex items-start gap-2.5 rounded-card border border-line bg-surface p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
        <p className="text-xs leading-relaxed text-faint">
          This is a probability estimate from public evidence, not a statement
          about what will happen. Predictly does not give financial, legal,
          medical or betting advice, and takes no bets.
        </p>
      </footer>
    </article>
  );
}

function ResolutionNotice({ forecast }: { forecast: ForecastResult }) {
  const resolved = forecast.outcomes.find((o) => o.id === forecast.resolvedOutcomeId);
  const config = {
    correct: { icon: ShieldCheck, tone: "text-yes border-yes/40 bg-yes/[0.06]", label: "Resolved correct" },
    wrong: { icon: XCircle, tone: "text-no border-no/40 bg-no/[0.06]", label: "Resolved wrong" },
    cancelled: { icon: CircleSlash, tone: "text-muted border-line bg-surface", label: "Cancelled" },
  }[forecast.resolutionStatus as "correct" | "wrong" | "cancelled"];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className={`mb-8 flex items-start gap-3 rounded-card border p-4 ${config.tone}`}>
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
              className="underline underline-offset-2 hover:text-fg"
            >
              Source
            </a>
          ) : null}
        </p>
      </div>
    </div>
  );
}
