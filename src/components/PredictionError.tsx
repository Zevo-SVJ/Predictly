"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
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

export function PredictionError({
  code,
  message,
  hint,
  onRetry,
}: {
  code: ForecastErrorCode;
  message?: string;
  hint?: string;
  onRetry: () => void;
}) {
  const copy = COPY[code] ?? COPY.internal_error;

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-line bg-surface">
        <AlertTriangle className="size-5 text-hedge" aria-hidden />
      </div>

      <h1 className="mt-6 text-2xl font-semibold leading-tight">{copy.title}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{copy.body}</p>

      {hint ? <p className="mt-3 text-sm text-faint">{hint}</p> : null}
      {message && process.env.NODE_ENV === "development" ? (
        <p className="mt-4 font-mono text-xs text-faint">{message}</p>
      ) : null}

      <button
        type="button"
        onClick={onRetry}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-elevated"
      >
        <RotateCcw className="size-4" aria-hidden />
        Ask something else
      </button>
    </div>
  );
}
