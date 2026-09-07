"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface PredictionInputProps {
  /**
   * Seeds the field on mount, e.g. so a failed question can be edited rather
   * than retyped. Remount with a `key` to reseed.
   */
  initialValue?: string;
  /** When provided, the component runs the flow in place instead of navigating. */
  onSubmit?: (question: string) => void;
  autoFocus?: boolean;
  pending?: boolean;
  size?: "default" | "large";
  className?: string;
}

const MAX_LENGTH = 240;

/**
 * The single input the whole product is built around. No model picker, no
 * category select, no depth slider — the system decides all of that.
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
          "edge-lit group flex items-center gap-2 rounded-full border border-line-strong bg-elevated transition-colors focus-within:border-lime/50",
          large ? "p-1.5 pl-5" : "p-1 pl-4",
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
          onChange={(event) => {
            setQuestion(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Ask about a future event…"
          aria-describedby={error ? "prediction-error" : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-fg outline-none disabled:opacity-60",
            large ? "py-2.5 text-base sm:text-lg" : "py-2 text-[15px]",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-lime font-medium text-lime-ink transition-colors hover:bg-lime-dim disabled:opacity-70",
            large ? "px-5 py-2.5 text-[15px]" : "px-4 py-2 text-sm",
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
              <ArrowRight className="size-4 transition-transform group-focus-within:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </div>

      {error ? (
        <p id="prediction-error" role="alert" className="mt-2 pl-5 text-sm text-no">
          {error}
        </p>
      ) : null}
    </form>
  );
}
