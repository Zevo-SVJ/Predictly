import type { z } from "zod";

/**
 * The reasoning steps the forecast engine delegates to a language model.
 *
 * Deliberately narrow: the model interprets the question and judges individual
 * sources, but it never picks the final number. Probability arithmetic lives in
 * `forecast/probability.ts` so it is inspectable and testable.
 */
export type ReasoningTask = "understand" | "evaluate" | "narrate";

export interface ReasoningRequest<T> {
  task: ReasoningTask;
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  /**
   * Structured view of the same information given in `prompt`. The development
   * fallback works from this instead of parsing prose.
   */
  input: unknown;
  maxTokens?: number;
}

export interface ReasoningProvider {
  readonly name: string;
  readonly isDevFallback: boolean;
  run<T>(request: ReasoningRequest<T>): Promise<T>;
}

export class ReasoningProviderError extends Error {
  constructor(
    message: string,
    readonly kind: "timeout" | "rate_limit" | "unauthorized" | "invalid_output" | "network",
  ) {
    super(message);
    this.name = "ReasoningProviderError";
  }
}
