"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface PredictionInputProps {
  /**
   * Seeds the field on mount — a trending question, or a failed one being
   * edited. Remount with a `key` to reseed.
   */
  initialValue?: string;
  /** When provided, runs the flow in place instead of navigating. */
  onSubmit?: (question: string) => void;
  autoFocus?: boolean;
  pending?: boolean;
  size?: "default" | "large";
  className?: string;
}

const MAX_LENGTH = 240;

/**
 * The single control the whole product is built around.
 *
 * No model picker, no category, no depth slider — Predictly decides all of it.
 * The lime ring on focus is the only chrome that appears, so the field reads as
 * a physical object that lights up rather than a form input.
 */
export function PredictionInput({
  initialValue = "",
  onSubmit,
  autoFocus = false,
  pending = false,
  size = "default",
  className,
}: PredictionInputProps) {
  const [question, setQuestion] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = question.trim();

    if (trimmed.length < 8) {
      setError("Ask about a specific future event — a few more words will do it.");
      inputRef.current?.focus();
      return;
    }
    setError(null);
    track("prediction_started", { length: trimmed.length, inline: Boolean(onSubmit) });

    if (onSubmit) onSubmit(trimmed);
    else router.push(`/predict?q=${encodeURIComponent(trimmed)}`);
  }

  const large = size === "large";

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)} noValidate>
      <div
        className={cn(
          "edge-lit flex items-center gap-2 rounded-2xl border bg-elevated transition-all duration-300",
          focused ? "border-lime/45 ring-4 ring-lime/10" : "border-line-strong",
          large ? "p-2 pl-5 sm:pl-6" : "p-1.5 pl-4",
        )}
      >
        <label htmlFor="prediction-question" className="sr-only">
          Ask about a future event
        </label>
        <input
          ref={inputRef}
          id="prediction-question"
          name="question"
          type="text"
          inputMode="text"
          enterKeyHint="go"
          autoComplete="off"
          autoFocus={autoFocus}
          maxLength={MAX_LENGTH}
          disabled={pending}
          value={question}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => {
            setQuestion(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Ask about a future event…"
          aria-describedby={error ? "prediction-error" : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-fg outline-none disabled:opacity-60",
            large ? "py-3 text-[16px] sm:text-[17px]" : "py-2.5 text-[15px]",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl bg-lime font-medium text-lime-ink",
            "transition-all duration-200 hover:bg-lime-dim active:scale-[0.97] disabled:opacity-70",
            large ? "px-5 py-3 text-[15px] sm:px-6" : "px-4 py-2.5 text-sm",
          )}
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              <span>Working</span>
            </>
          ) : (
            <>
              <span>Predict</span>
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
      </div>

      {error ? (
        <p id="prediction-error" role="alert" className="mt-2.5 pl-1 text-sm text-no">
          {error}
        </p>
      ) : null}
    </form>
  );
}
