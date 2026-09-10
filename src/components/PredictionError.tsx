import { AlertTriangle } from "lucide-react";
import type { ForecastErrorCode } from "@/lib/types";

/**
 * Honest failure states.
 *
 * Every branch tells the user what actually went wrong and offers a way
 * forward. Nothing here ever invents evidence to make the screen look
 * successful.
 */
const COPY: Record<ForecastErrorCode, { title: string; body: string }> = {
  not_configured: {
    title: "Predictly isn't fully configured",
    body: "This deployment is missing a research or reasoning API key, so Predictly cannot do the work a forecast requires. Rather than invent a number, it stops here.",
  },
  malformed_question: {
    title: "That's not quite a question about an event",
    body: "Predictly works best with a specific future occurrence — something that will clearly either happen or not.",
  },
  not_about_future: {
    title: "This one has already been settled",
    body: "Predictly forecasts events that haven't resolved yet. Ask about something still open.",
  },
  ambiguous_event: {
    title: "This event is too ambiguous to forecast",
    body: "There's no clear way to tell whether it happened. Add a deadline, or say what would count as it happening.",
  },
  no_search_results: {
    title: "We couldn't find anything to work from",
    body: "The search came back empty for this event. That usually means it's phrased in a way the web doesn't recognise yet.",
  },
  insufficient_evidence: {
    title: "We couldn't make a reliable forecast",
    body: "There isn't enough recent evidence to estimate this event responsibly. Rather than guess, Predictly stops here.",
  },
  research_failed: {
    title: "The research step failed",
    body: "Predictly couldn't reach enough sources to work from. This is usually temporary.",
  },
  provider_timeout: {
    title: "Research took too long",
    body: "The sources didn't come back in time. Trying again usually works.",
  },
  rate_limited: {
    title: "You've hit the limit for now",
    body: "Predictly is free during launch, which means a cap on how fast forecasts can run. Come back shortly.",
  },
  storage_failed: {
    title: "The forecast couldn't be saved",
    body: "The research completed, but Predictly couldn't write it to the database, so there's no link to share.",
  },
  internal_error: {
    title: "Something broke on our side",
    body: "That's on us, not on your question. Try again, or ask about a different event.",
  },
};

/**
 * Copy only — no actions.
 *
 * The stage that renders this already offers both ways forward: a button back
 * to the page, and the question itself sitting in an editable field below. A
 * retry button here as well produced two controls with the same label in one
 * view.
 */
export function PredictionError({
  code,
  message,
  hint,
}: {
  code: ForecastErrorCode;
  message?: string;
  hint?: string;
}) {
  const copy = COPY[code] ?? COPY.internal_error;

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border bg-canvas">
        <AlertTriangle className="size-5 text-hedge" aria-hidden />
      </div>

      <h2 className="mt-6 text-xl font-semibold leading-tight">{copy.title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{copy.body}</p>

      {hint ? <p className="mt-3 text-sm text-faint">{hint}</p> : null}
      {message && process.env.NODE_ENV === "development" ? (
        <p className="mt-4 font-mono text-xs text-faint">{message}</p>
      ) : null}

    </div>
  );
}
