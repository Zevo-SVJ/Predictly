import { NextResponse } from "next/server";
import { z } from "zod";
import { ForecastEngine } from "@/lib/forecast/engine";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { getPredictionStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/supabase/server";
import { ForecastError, type ForecastStreamEvent, type Stage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Research plus three model calls; give it room without hanging forever. */
export const maxDuration = 120;

const RequestSchema = z.object({
  question: z.string().trim().min(8, "Ask about a specific future event.").max(240),
});

/**
 * Runs the forecasting pipeline and streams stage updates as NDJSON.
 *
 * One JSON object per line, so the client can render real progress without a
 * websocket and without pretending to make progress it hasn't made.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { code: "malformed_question", message: parsed.error.issues[0]?.message ?? "Invalid question." },
      { status: 400 },
    );
  }

  const user = await getCurrentUser();
  const limit = checkRateLimit(clientKey(request.headers, user?.id ?? null), Boolean(user));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        code: "rate_limited",
        message: "You've hit the forecast limit for now.",
        hint: `Try again after ${new Date(limit.resetAt).toUTCString()}.`,
      },
      { status: 429, headers: { "retry-after": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } },
    );
  }

  const encoder = new TextEncoder();
  const store = await getPredictionStore();
  const engine = new ForecastEngine();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (event: ForecastStreamEvent) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        const forecast = await engine.run({
          question: parsed.data.question,
          userId: user?.id ?? null,
          onProgress: (stage: Stage, detail?: string) => send({ type: "stage", stage, detail }),
        });

        // Persistence failure must not throw away a completed forecast: the user
        // still sees it, they just can't link to it later.
        try {
          await store.save(forecast);
        } catch (error) {
          console.error("Could not persist forecast:", error);
        }

        send({ type: "result", forecast });
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
