"use client";

import { Bookmark, Check, Link2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/analytics";
import type { Forecast } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved" | "needs-auth" | "error";

/**
 * Save and share.
 *
 * Saving is what triggers authentication — a visitor gets a full forecast with
 * no account, and is only asked to sign in when they want to keep it.
 */
export function ForecastActions({ forecast }: { forecast: Forecast }) {
  const [saveState, setSaveState] = useState<SaveState>(
    forecast.userId ? "saved" : "idle",
  );
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
          text: `${Math.round(forecast.probability * 100)}% — ${forecast.question}`,
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
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={handleSave}
        disabled={saveState === "saving" || saveState === "saved"}
        className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-medium text-lime-ink transition-colors hover:bg-lime-dim disabled:opacity-70"
      >
        {saveState === "saving" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : saveState === "saved" ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Bookmark className="size-4" aria-hidden />
        )}
        {saveState === "saved" ? "Saved" : "Save this prediction"}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-elevated"
      >
        {copied ? <Check className="size-4 text-lime" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        {copied ? "Link copied" : "Share"}
      </button>

      <span role="status" aria-live="polite" className="text-sm text-muted">
        {saveState === "error" ? "Couldn't save that — try again." : null}
        {saveState === "needs-auth" ? "Sign in to keep this forecast." : null}
      </span>
    </div>
  );
}
