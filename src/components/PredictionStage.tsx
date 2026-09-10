"use client";

import { ArrowLeft } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ForecastResult as ForecastResultView } from "./ForecastResult";
import { PredictionError } from "./PredictionError";
import { ShareForecast } from "./ShareForecast";
import { Hero } from "./landing/Hero";
import { PredictionInput } from "./product/PredictionInput";
import { ResearchProgress } from "./product/ResearchProgress";
import { track } from "@/lib/analytics";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { readNdjson } from "@/lib/ndjson";
import { STAGE_LABEL, type ForecastErrorCode, type ForecastResult, type Stage } from "@/lib/types";

/**
 * Lets anything rendered below the stage hand it a question.
 *
 * The final call to action at the foot of the page uses this: a visitor who has
 * read that far already has a question in mind, and sending them back up to the
 * hero to type it is a step that only exists because the page was built
 * top-down. Outside a stage — on the login or history pages — the hook returns
 * `null` and the caller falls back to a route.
 */
const AskContext = createContext<((question: string) => void) | null>(null);

export function useAskPredictly(): ((question: string) => void) | null {
  return useContext(AskContext);
}

type StageState =
  | { phase: "idle"; seed?: string }
  | { phase: "running"; question: string; stage: Stage; detail?: string }
  | { phase: "result"; forecast: ForecastResult }
  | { phase: "error"; question: string; code: ForecastErrorCode; message: string; hint?: string };

/**
 * The homepage, and the forecast it turns into.
 *
 * Submitting a question does not navigate. The region that held the hero
 * becomes the research view and then the forecast, with the question pinned
 * above it the whole way. `children` — the rest of the landing page — is
 * unmounted the moment a run starts, because a live forecast should not be
 * sharing a screen with an explanation of what forecasts are.
 *
 * `children` still renders on the server in the idle phase, so the page a
 * crawler or a visitor with no JavaScript sees is the complete one.
 */
export function PredictionStage({
  initialQuestion,
  returnPath = "/",
  children,
}: {
  /** Starts a run immediately — how `/predict?q=` arrives. */
  initialQuestion?: string;
  /** Where the URL goes back to when the visitor asks something else. */
  returnPath?: string;
  children?: ReactNode;
}) {
  const [state, setState] = useState<StageState>(() =>
    initialQuestion
      ? { phase: "running", question: initialQuestion, stage: "understanding" }
      : { phase: "idle" },
  );
  const abortRef = useRef<AbortController | null>(null);
  const stageRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const active = state.phase !== "idle";

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

      // Non-2xx responses (validation, rate limit, unconfigured) are plain
      // JSON, never a stream — they have a body, so this keys off status.
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
        track("prediction_failed", { code: payload?.code ?? "internal_error" });
        return;
      }

      if (!response.body) {
        setState({
          phase: "error",
          question,
          code: "internal_error",
          message: "No response stream.",
        });
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
          // Give the forecast a real, refreshable URL without a navigation —
          // the page stays exactly where it is.
          window.history.replaceState(null, "", `/predict/${event.prediction.id}`);
        } else if (event.type === "error") {
          setState({
            phase: "error",
            question,
            code: event.code,
            message: event.message,
            hint: event.hint,
          });
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
      track("prediction_started", { length: question.length });
      void run(question, controller.signal);
    },
    [run],
  );

  const reset = useCallback(
    (seed?: string) => {
      abortRef.current?.abort();
      abortRef.current = null;
      setState({ phase: "idle", seed });
      window.history.replaceState(null, "", returnPath);
    },
    [returnPath],
  );

  // Auto-start when arriving with a question already in hand (`/predict?q=`).
  //
  // The effect owns the controller so React's development remount aborts the
  // first attempt and the remount starts a fresh one. A guard ref would instead
  // block that restart and leave the flow stuck on the research view.
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

  // Bring the stage into view when it takes over — the visitor may have
  // submitted from the call to action at the very foot of the page.
  useEffect(() => {
    if (!active) return;
    stageRef.current?.scrollIntoView({
      block: "start",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [active, reducedMotion]);

  // Abort anything still in flight when the visitor navigates away.
  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <>
      <section
        ref={stageRef}
        id="stage"
        className="relative scroll-mt-4 pb-14 pt-24 sm:pb-20 sm:pt-32 lg:pb-24"
      >
        <div className="container-wide">
          {state.phase === "idle" ? (
            <Hero onSubmit={start} />
          ) : (
            <div className="mx-auto w-full max-w-5xl">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-[13px] text-muted transition-colors hover:border-border-strong hover:text-ink"
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                Ask something else
              </button>

              <div className="mt-8 sm:mt-10">
                {state.phase === "running" ? (
                  <Researching
                    question={state.question}
                    stage={state.stage}
                    detail={state.detail}
                  />
                ) : null}

                {state.phase === "result" ? (
                  <div className="space-y-12 sm:space-y-16">
                    <ForecastResultView forecast={state.forecast} />
                    <div className="border-t border-border pt-10">
                      <h2 className="eyebrow">Share this forecast</h2>
                      <ShareForecast
                        forecast={state.forecast}
                        onAskAnother={() => reset()}
                        className="mt-5"
                      />
                    </div>
                  </div>
                ) : null}

                {state.phase === "error" ? (
                  <div className="py-4">
                    {/* The question stays the heading even when the run fails:
                        it is still what the screen is about. */}
                    <h1 className="mx-auto max-w-xl text-center text-[20px] font-semibold leading-snug tracking-[-0.02em] sm:text-[24px]">
                      {state.question}
                    </h1>
                    <div className="mt-8">
                      <PredictionError
                        code={state.code}
                        message={state.message}
                        hint={state.hint}
                      />
                    </div>

                    {/* The question survives the failure: it is already back in
                        the field, ready to be edited rather than retyped. */}
                    <div className="mx-auto mt-10 max-w-xl">
                      <PredictionInput
                        key={state.question}
                        initialValue={state.question}
                        onSubmit={start}
                        size="sm"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>

      {state.phase === "idle" ? (
        <AskContext.Provider value={start}>{children}</AskContext.Provider>
      ) : null}
    </>
  );
}

/** The research view: the question, pinned, and the work happening under it. */
function Researching({
  question,
  stage,
  detail,
}: {
  question: string;
  stage: Stage;
  detail?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-cobalt">
        <span className="size-1.5 animate-pulse rounded-full bg-cobalt" aria-hidden />
        {STAGE_LABEL[stage]}
      </p>

      {/* The question never leaves the screen. It is what the numbers below
          are about, and losing it turns the forecast into a floating figure. */}
      <h1 className="mt-4 text-[24px] font-semibold leading-[1.12] tracking-[-0.035em] sm:text-[34px]">
        {question}
      </h1>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
        <ResearchProgress stage={stage} detail={detail} />
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-faint">
        Predictly reads the sources it finds, judges each one on its own, then
        aggregates them into a probability. This usually takes under a minute.
      </p>
    </div>
  );
}
