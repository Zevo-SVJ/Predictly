"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface QuestionInputProps {
  /** Seeds the field on mount. Remount with a `key` to reseed. */
  initialValue?: string;
  /** Runs the flow in place instead of navigating. */
  onSubmit?: (question: string) => void;
  /** Example questions cycled through the placeholder while the field is empty. */
  examples?: string[];
  autoFocus?: boolean;
  pending?: boolean;
  size?: "default" | "hero";
  className?: string;
}

const MAX_LENGTH = 240;
const CYCLE_MS = 3600;

/**
 * The object the whole product is built around.
 *
 * No model picker, no category, no depth slider — Predictly decides all of it.
 * While empty and unfocused the placeholder cycles through real questions from
 * the trending set, which is the invitation to play; the moment the field is
 * touched it goes quiet and stays out of the way.
 */
export function QuestionInput({
  initialValue = "",
  onSubmit,
  examples = [],
  autoFocus = false,
  pending = false,
  size = "default",
  className,
}: QuestionInputProps) {
  const [question, setQuestion] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const idle = !focused && question.length === 0 && examples.length > 0;

  useEffect(() => {
    if (!idle) return;
    const timer = setInterval(
      () => setExampleIndex((index) => (index + 1) % examples.length),
      CYCLE_MS,
    );
    return () => clearInterval(timer);
  }, [idle, examples.length]);

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

  const hero = size === "hero";

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)} noValidate>
      <div
        className={cn(
          "edge-lit relative flex items-center gap-2 rounded-[20px] border bg-raised",
          "transition-[border-color,box-shadow,background-color] duration-300",
          focused
            ? "border-lime/55 bg-elevated ring-[10px] ring-lime/[0.06]"
            : "border-line-strong hover:border-white/25",
          hero ? "p-2 pl-5 sm:p-2.5 sm:pl-8" : "p-1.5 pl-4",
        )}
      >
        <label htmlFor="question-input" className="sr-only">
          Ask a question about the future
        </label>

        {/* Cycling examples sit behind the field: a real placeholder attribute
            can't animate, and this keeps the input's own value untouched. */}
        {idle ? (
          // Bounded on both sides so the text truncates instead of running
          // under the button; the right inset clears the CTA at each size.
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 flex items-center overflow-hidden text-faint",
              hero
                ? "left-5 right-[8.75rem] text-[16.5px] sm:left-8 sm:right-[12.5rem] sm:text-[21px]"
                : "left-4 right-[7.5rem] text-[15px]",
            )}
          >
            <span key={exampleIndex} className="animate-rise-in truncate">
              {examples[exampleIndex]}
            </span>
            <span className="animate-caret ml-0.5 inline-block h-[1.1em] w-px shrink-0 translate-y-[0.1em] bg-lime" />
          </span>
        ) : null}

        <input
          ref={inputRef}
          id="question-input"
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
          placeholder={idle ? "" : "Ask a question about the future…"}
          aria-describedby={error ? "question-error" : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "relative min-w-0 flex-1 bg-transparent text-fg outline-none disabled:opacity-60",
            hero ? "py-4 text-[16.5px] sm:py-5 sm:text-[21px]" : "py-2.5 text-[15px]",
          )}
        />

        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl bg-lime font-medium text-lime-ink",
            "transition-all duration-200 hover:bg-lime-dim active:scale-[0.97] disabled:opacity-70",
            hero ? "px-5 py-3.5 text-[15px] sm:px-8 sm:py-4 sm:text-[16px]" : "px-4 py-2.5 text-sm",
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
        <p id="question-error" role="alert" className="mt-2.5 pl-1 text-sm text-no">
          {error}
        </p>
      ) : null}
    </form>
  );
}
