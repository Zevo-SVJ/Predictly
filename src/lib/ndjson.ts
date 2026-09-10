import type { ForecastStreamEvent } from "@/lib/types";

/**
 * Parses a newline-delimited JSON body into typed forecast events.
 *
 * Split out of the flow component because the prediction stage and any future
 * consumer of `/api/predict` need identical framing behaviour — in particular,
 * never treating a truncated trailing chunk on an aborted stream as an error.
 */
export async function* readNdjson(
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
