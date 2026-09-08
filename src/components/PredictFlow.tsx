"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { PredictionError } from "./PredictionError";
import { QuestionInput } from "./QuestionInput";
import { PredictionLoading } from "./PredictionLoading";
import { PredictionResult } from "./PredictionResult";
import { TrendingTicker } from "./TrendingTicker";
import { getTrendingRails } from "@/lib/trending";
import type { ForecastErrorCode, ForecastResult, ForecastStreamEvent, Stage } from "@/lib/types";

type FlowState =
  | { phase: "idle"; seed?: string }
  | { phase: "running"; question: string; stage: Stage; detail?: string }
  | { phase: "result"; forecast: ForecastResult }
  | { phase: "error"; question: string; code: ForecastErrorCode; message: string; hint?: string };

/**
 * Drives one forecast from question to result.
 *
 * Reads the NDJSON stream from `/api/forecast` so the loading UI advances only
 * when the server actually reaches a stage.
 */
export function PredictFlow({ initialQuestion }: { initialQuestion?: string }) {
  // Seeded lazily so arriving with ?q= renders the loading UI on the first
  // paint, without an effect having to set state synchronously. `PredictPage`
  // keys this component by the question, so a new one remounts it.
  const [state, setState] = useState<FlowState>(() =>
    initialQuestion
      ? { phase: "running", question: initialQuestion, stage: "understanding" }
      : { phase: "idle" },
  );
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Runs one forecast against a caller-owned signal. The caller owns the
   * lifetime so the auto-start effect below can abort and restart cleanly — a
   * run that owned its own guard would be cancelled by React's development
   * remount and never restart.
   */
  const run = useCallback(async (question: string, signal: AbortSignal) => {
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
        signal,
      });

      // Non-2xx responses (validation, rate limit) are plain JSON, never a
      // stream — they have a body, so this must key off status, not body.
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { code?: ForecastErrorCode; message?: string; hint?: string }
          | null;
        setState({
          phase: "error",
          question,
          code: payload?.code ?? "internal_error",
          message: payload?.message ?? "The forecast could not be started.",
          hint: payload?.hint,
        });
        return;
      }

      if (!response.body) {
        setState({ phase: "error", question, code: "internal_error", message: "No response stream." });
        return;
      }

      for await (const event of readNdjson(response.body, signal)) {
        if (event.type === "stage") {
          setState((current) =>
            current.phase === "running"
              ? { ...current, stage: event.stage, detail: event.detail }
              : current,
          );
        } else if (event.type === "result") {
          setState({ phase: "result", forecast: event.prediction });
          track("prediction_completed", {
            id: event.prediction.id,
            category: event.prediction.category,
            confidence: event.prediction.confidence,
          });
          // Give the forecast a real URL without a full navigation.
          window.history.replaceState(null, "", `/predict/${event.prediction.id}`);
        } else if (event.type === "error") {
          setState({ phase: "error", question, code: event.code, message: event.message, hint: event.hint });
          track("prediction_failed", { code: event.code });
        }
      }
    } catch (error) {
      if (signal.aborted) return;
      setState({
        phase: "error",
        question,
        code: "internal_error",
        message: error instanceof Error ? error.message : "Unknown failure",
      });
      track("prediction_failed", { code: "internal_error" });
    }
  }, []);

  /** Starts a run from user input, replacing any run already in flight. */
  const start = useCallback(
    (question: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setState({ phase: "running", question, stage: "understanding" });
      void run(question, controller.signal);
    },
    [run],
  );

  // Auto-start when arriving with ?q= (from the hero or a trending pill).
  //
  // The effect owns the controller so React's development remount aborts the
  // first attempt and the remount starts a fresh one. A guard ref would instead
  // block that restart and leave the flow stuck on the loading screen.
  useEffect(() => {
    if (!initialQuestion) return;
    const controller = new AbortController();
    abortRef.current = controller;
    // `run` only updates state after awaiting the network, which is the
    // fetch-in-effect pattern the rule cannot distinguish from a render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void run(initialQuestion, controller.signal);
    return () => controller.abort();
  }, [initialQuestion, run]);

  // Abort anything still in flight when the user navigates away.
  useEffect(() => () => abortRef.current?.abort(), []);

  if (state.phase === "running") {
    return <PredictionLoading question={state.question} stage={state.stage} detail={state.detail} />;
  }

  if (state.phase === "result") {
    return <PredictionResult forecast={state.forecast} />;
  }

  if (state.phase === "error") {
    return (
      <PredictionError
        code={state.code}
        message={state.message}
        hint={state.hint}
        onRetry={() => {
          // Carry the question back into the field so it can be edited, and
          // drop ?q= from the URL without a navigation — a route change would
          // remount this component and lose the seed.
          setState({ phase: "idle", seed: state.question });
          window.history.replaceState(null, "", "/predict");
        }}
      />
    );
  }

  return <IdleState onSubmit={start} seed={state.seed} />;
}

function IdleState({ onSubmit, seed }: { onSubmit: (question: string) => void; seed?: string }) {
  const [railOne, railTwo] = getTrendingRails();
  const examples = railOne.slice(0, 5).map((event) => event.question);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
        What do you want to know?
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Ask about any upcoming event. Predictly researches the latest
        information and turns it into a probability.
      </p>

      <QuestionInput
        className="mt-8"
        initialValue={seed}
        onSubmit={onSubmit}
        examples={examples}
        autoFocus
        size="hero"
      />

      <div className="mt-12 space-y-2.5">
        <p className="text-xs uppercase tracking-widest text-faint">Worth predicting</p>
        <TrendingTicker events={railOne} direction="left" durationSeconds={130} />
        <TrendingTicker events={railTwo} direction="right" durationSeconds={155} />
      </div>
    </div>
  );
}

/** Parses a newline-delimited JSON stream into typed events. */
async function* readNdjson(
  body: ReadableStream<Uint8Array>,
  signal: AbortSignal,
): AsyncGenerator<ForecastStreamEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          yield JSON.parse(line) as ForecastStreamEvent;
        } catch {
          // A partial line can only happen on an aborted stream; skip it.
        }
      }
    }

    if (buffer.trim()) {
      try {
        yield JSON.parse(buffer) as ForecastStreamEvent;
      } catch {
        // Truncated trailing chunk.
      }
    }
  } finally {
    reader.releaseLock();
  }
}
