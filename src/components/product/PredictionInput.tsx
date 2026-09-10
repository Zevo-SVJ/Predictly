"use client";

import { ArrowRight, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MIN_LENGTH = 8;
const MAX_LENGTH = 240;

/**
 * The one control the whole product is built around.
 *
 * A textarea rather than an input: on a 375px screen a real question wraps, and
 * a single-line field that scrolls sideways hides the user's own words from
 * them at the moment they are deciding whether to submit. Enter submits;
 * Shift+Enter breaks the line.
 *
 * No model picker, no category, no depth slider. Predictly decides all of it.
 */
export function PredictionInput({
  initialValue = "",
  onSubmit,
  pending = false,
  autoFocus = false,
  placeholder = "Ask Predictly anything about the future...",
  size = "lg",
  className,
}: {
  initialValue?: string;
  onSubmit: (question: string) => void;
  pending?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  size?: "lg" | "sm";
  className?: string;
}) {
  const [question, setQuestion] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const large = size === "lg";
  const trimmed = question.trim();
  const ready = trimmed.length >= MIN_LENGTH;

  // Grow to fit the question instead of scrolling it out of sight.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight}px`;
  }, [question, large]);

  function submit() {
    if (pending) return;
    if (!ready) {
      setError("Ask about a specific future event — a few more words will do it.");
      fieldRef.current?.focus();
      return;
    }
    setError(null);
    onSubmit(trimmed);
  }

  return (
    <form
      // A real GET to the prediction route. Scripting takes over and runs the
      // forecast in place; without it the form still goes somewhere useful
      // instead of silently doing nothing.
      action="/predict"
      method="get"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn("w-full", className)}
      noValidate
    >
      <div
        className={cn(
          "rounded-[var(--radius-lg)] border bg-white transition-all duration-200",
          focused
            ? "border-cobalt shadow-[0_0_0_4px_var(--color-cobalt-soft)]"
            : "border-border-strong shadow-[var(--shadow-card)] hover:border-border-strong",
          large ? "p-3 sm:p-4" : "p-2.5",
        )}
      >
        <div className="flex items-start gap-3">
          <Search
            className={cn(
              "mt-[0.35rem] shrink-0 transition-colors",
              large ? "size-[18px]" : "size-4",
              focused ? "text-cobalt" : "text-muted",
            )}
            aria-hidden
          />

          <label htmlFor="prediction-input" className="sr-only">
            Ask Predictly about a future event
          </label>

          <textarea
            ref={fieldRef}
            id="prediction-input"
            name="q"
            rows={1}
            maxLength={MAX_LENGTH}
            disabled={pending}
            value={question}
            enterKeyHint="go"
            autoComplete="off"
            autoFocus={autoFocus}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(event) => {
              setQuestion(event.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={placeholder}
            aria-describedby={error ? "prediction-input-error" : undefined}
            aria-invalid={error ? true : undefined}
            className={cn(
              "block w-full resize-none bg-transparent py-1 leading-snug text-ink outline-none",
              "placeholder:text-muted disabled:opacity-60",
              // 16px floor: below it, iOS Safari zooms the page on focus and the
              // whole composition breaks on the devices most of this traffic
              // arrives from.
              large ? "text-[16px] sm:text-[18px]" : "text-[16px]",
            )}
          />
        </div>

        {/* Full-width button on a phone — a 44px target beats a tidy inline row. */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span
            className="font-mono text-[11px] tabular-nums text-muted transition-opacity duration-200"
            // Empty at rest: "0/240" under an untouched field reads as debug
            // output. aria-hidden while blank so it is not announced either.
            aria-hidden={question.length === 0}
          >
            {question.length > 0 ? `${question.length}/${MAX_LENGTH}` : ""}
          </span>

          <button
            type="submit"
            disabled={pending}
            className={cn(
              "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-md)]",
              "bg-cobalt font-medium text-white transition-all duration-200",
              "hover:bg-cobalt-deep active:scale-[0.98] disabled:opacity-60",
              large ? "px-5 py-2.5 text-[15px]" : "px-4 py-2 text-[14px]",
            )}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Researching
              </>
            ) : (
              <>
                Predict
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </button>
        </div>
      </div>

      {error ? (
        <p id="prediction-input-error" role="alert" className="mt-2 pl-1 text-[13px] text-counters">
          {error}
        </p>
      ) : null}
    </form>
  );
}
