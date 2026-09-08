import { NextResponse } from "next/server";
import { z } from "zod";
import { ForecastEngine } from "@/lib/forecast/engine";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { getPredictionStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/supabase/server";
import { ForecastError, type ForecastStreamEvent, type Stage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Research plus three model calls; generous, but bounded. */
export const maxDuration = 300;

const RequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(8, "Ask about a specific future event.")
    .max(240, "That question is too long to forecast reliably."),
});

/** Non-streaming failures share one shape with the stream's `error` event. */
function failure(code: string, message: string, hint: string | undefined, status: number, headers?: HeadersInit) {
  return NextResponse.json({ code, message, hint }, { status, headers });
}

/**
 * Runs the forecasting pipeline and streams stage updates as NDJSON.
 *
 * One JSON object per line. Stages are emitted when the server actually
 * reaches them, so the client never invents progress it hasn't made.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return failure(
      "malformed_question",
      parsed.error.issues[0]?.message ?? "That isn't a question we can forecast.",
      "Ask about a single, specific future event.",
      400,
    );
  }

  const user = await getCurrentUser();
  const limit = checkRateLimit(clientKey(request.headers, user?.id ?? null), Boolean(user));
  if (!limit.allowed) {
    return failure(
      "rate_limited",
      "You've hit the forecast limit for now.",
      `Try again after ${new Date(limit.resetAt).toUTCString()}.`,
      429,
      { "retry-after": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
    );
  }

  // Provider resolution happens before the stream opens so an unconfigured
  // deployment returns a plain 503 rather than a stream that immediately dies.
  let engine: ForecastEngine;
  try {
    engine = new ForecastEngine();
  } catch (error) {
    if (error instanceof ForecastError) {
      return failure(error.code, error.message, error.hint, 503);
    }
    return failure("internal_error", "Predictly could not start a forecast.", undefined, 500);
  }

  const encoder = new TextEncoder();
  const store = await getPredictionStore();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (event: ForecastStreamEvent) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        const prediction = await engine.run({
          question: parsed.data.question,
          userId: user?.id ?? null,
          onProgress: (stage: Stage, detail?: string) => send({ type: "stage", stage, detail }),
        });

        // Persistence failure must not throw away completed research: the user
        // still sees the forecast, they just can't link to it later.
        try {
          await store.save(prediction);
        } catch (error) {
          console.error("Could not persist prediction:", error);
        }

        send({ type: "result", prediction });
      } catch (error) {
        if (error instanceof ForecastError) {
          send({ type: "error", code: error.code, message: error.message, hint: error.hint });
        } else {
          console.error("Forecast pipeline failed:", error);
          send({
            type: "error",
            code: "internal_error",
            message: "Something broke while building this forecast.",
            hint: "Try again, or ask about a different event.",
          });
        }
      } finally {
        closed = true;
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
