"use client";

import { Bookmark, Check, Link2, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { ProbabilityBar } from "./product/ProbabilityBar";
import { track } from "@/lib/analytics";
import type { ForecastResult } from "@/lib/types";
import { cn, formatDate, formatPercent, probabilityVerdict } from "@/lib/utils";

type SaveState = "idle" | "saving" | "saved" | "needs-auth" | "error";

/**
 * The screenshot, and everything you can do with it.
 *
 * The card is DOM rather than a generated image: it renders identically here
 * and in an OG route, needs no image pipeline, and — the reason that matters —
 * a phone screenshot of it is already the shareable asset, which is how a
 * forecast actually travels.
 *
 * Two aspect ratios, because the destinations disagree: portrait on a phone for
 * a story or a feed post, landscape from a desktop for a link preview.
 */
export function ShareForecast({
  forecast,
  onAskAnother,
  className,
}: {
  forecast: ForecastResult;
  onAskAnother?: () => void;
  className?: string;
}) {
  const [saveState, setSaveState] = useState<SaveState>(forecast.userId ? "saved" : "idle");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaveState("saving");
    try {
      const response = await fetch(`/api/predictions/${forecast.id}/claim`, { method: "POST" });

      if (response.status === 401) {
        setSaveState("needs-auth");
        track("signup_started", { from: "save_prediction" });
        router.push(`/login?next=${encodeURIComponent(`/predict/${forecast.id}`)}`);
        return;
      }
      if (!response.ok) {
        setSaveState("error");
        return;
      }
      setSaveState("saved");
      track("prediction_saved", { id: forecast.id, category: forecast.category });
    } catch {
      setSaveState("error");
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/predict/${forecast.id}`;
    track("prediction_shared", { id: forecast.id });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Predictly — ${forecast.question}`,
          text: `${formatPercent(forecast.probability)} ${forecast.outcome} — ${forecast.question}`,
          url,
        });
        return;
      } catch {
        // Share sheet dismissed; fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="max-w-lg">
        <ShareCard forecast={forecast} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === "saving" || saveState === "saved"}
          className="inline-flex items-center gap-2 rounded-full bg-cobalt px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep disabled:opacity-60"
        >
          {saveState === "saving" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : saveState === "saved" ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Bookmark className="size-4" aria-hidden />
          )}
          {saveState === "saved" ? "Saved" : "Save"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
        >
          {copied ? (
            <Check className="size-4 text-cobalt" aria-hidden />
          ) : (
            <Link2 className="size-4" aria-hidden />
          )}
          {copied ? "Link copied" : "Share"}
        </button>

        {onAskAnother ? (
          <button
            type="button"
            onClick={onAskAnother}
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
          >
            <RotateCcw className="size-4" aria-hidden />
            Ask another
          </button>
        ) : null}

        <span role="status" aria-live="polite" className="text-sm text-muted">
          {saveState === "error" ? "Couldn't save that — try again." : null}
          {saveState === "needs-auth" ? "Sign in to keep this forecast." : null}
        </span>
      </div>
    </div>
  );
}

/** The card itself, extracted so an OG image route can render the same markup. */
export function ShareCard({ forecast }: { forecast: ForecastResult }) {
  const headline =
    forecast.outcomes.find((o) => o.id === forecast.headlineOutcomeId) ?? forecast.outcomes[0];

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-lift)] sm:aspect-[1200/630]">
      <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
        <span className="flex items-center gap-2 text-[13px] font-semibold tracking-tight text-ink">
          <Logo className="size-4" />
          Predictly
        </span>

        <div>
          <p className="line-clamp-3 text-[17px] font-medium leading-snug text-ink sm:line-clamp-2 sm:text-[21px]">
            {forecast.question}
          </p>

          <div className="mt-5 flex items-end gap-4">
            <span className="text-[3.5rem] font-semibold leading-[0.85] tracking-[-0.05em] tabular-nums text-cobalt sm:text-[4.5rem]">
              {formatPercent(forecast.probability)}
            </span>
            <span className="pb-1.5">
              <span className="block text-[15px] font-semibold text-ink sm:text-lg">
                {headline?.label}
              </span>
              <span className="mt-1 block text-[12px] text-muted sm:text-sm">
                {probabilityVerdict(forecast.probability)}
              </span>
            </span>
          </div>

          <ProbabilityBar probability={forecast.probability} leading className="mt-4" />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          {forecast.evidence.length} sources · {formatDate(forecast.researchedAt) ?? "—"}
        </p>
      </div>
    </div>
  );
}
