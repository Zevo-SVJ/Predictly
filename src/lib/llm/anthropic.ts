import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { serverEnv } from "@/lib/config";
import {
  ReasoningProviderError,
  type ReasoningProvider,
  type ReasoningRequest,
} from "./types";

/**
 * Claude-backed reasoning provider.
 *
 * Every call is a structured output request: the schema is the contract, so the
 * engine never string-parses model prose. Thinking is left adaptive (the
 * default on Opus 5) and `effort` is tuned per task — interpreting a question
 * is cheap, judging a source corpus is not.
 */
export class AnthropicReasoningProvider implements ReasoningProvider {
  readonly name = "anthropic";
  readonly isDevFallback = false;

  private readonly client: Anthropic;

  constructor(
    apiKey: string,
    private readonly model: string,
  ) {
    this.client = new Anthropic({ apiKey, maxRetries: 2, timeout: 120_000 });
  }

  async run<T>({ task, system, prompt, schema, maxTokens }: ReasoningRequest<T>): Promise<T> {
    try {
      const response = await this.client.messages.parse({
        model: this.model,
        max_tokens: maxTokens ?? 8_000,
        system,
        output_config: {
          format: zodOutputFormat(schema),
          effort: task === "evaluate" ? "high" : "medium",
        },
        messages: [{ role: "user", content: prompt }],
      });

      if (response.stop_reason === "refusal") {
        throw new ReasoningProviderError(
          `Model declined the ${task} step: ${response.stop_details?.explanation ?? "no explanation"}`,
          "invalid_output",
        );
      }
      if (response.parsed_output == null) {
        throw new ReasoningProviderError(
          `Model returned no parseable output for the ${task} step`,
          "invalid_output",
        );
      }
      return response.parsed_output as T;
    } catch (error) {
      throw toReasoningError(error);
    }
  }
}

function toReasoningError(error: unknown): ReasoningProviderError {
  if (error instanceof ReasoningProviderError) return error;
  if (error instanceof Anthropic.RateLimitError) {
    return new ReasoningProviderError("Claude rate limit reached", "rate_limit");
  }
  if (error instanceof Anthropic.AuthenticationError) {
    return new ReasoningProviderError("Claude rejected the API key", "unauthorized");
  }
  if (error instanceof Anthropic.APIConnectionTimeoutError) {
    return new ReasoningProviderError("Claude request timed out", "timeout");
  }
  if (error instanceof Anthropic.APIError) {
    return new ReasoningProviderError(`Claude API error: ${error.message}`, "network");
  }
  return new ReasoningProviderError(
    error instanceof Error ? error.message : "Unknown reasoning failure",
    "invalid_output",
  );
}

export function createAnthropicProvider(): AnthropicReasoningProvider | null {
  const key = serverEnv.anthropicApiKey();
  return key ? new AnthropicReasoningProvider(key, serverEnv.anthropicModel()) : null;
}
