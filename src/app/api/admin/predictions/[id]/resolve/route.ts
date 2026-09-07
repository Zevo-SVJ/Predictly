import { NextResponse } from "next/server";
import { z } from "zod";
import { getPredictionStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ResolveSchema = z.object({
  status: z.enum(["correct", "wrong", "cancelled"]),
  resolvedOutcomeId: z.string().max(48).nullable().default(null),
  resolutionSource: z.string().url().max(500).nullable().default(null),
});

/**
 * Manual resolution path.
 *
 * The MVP deliberately stops here: the schema and this endpoint are the
 * foundation, and automatic resolution is a later project. Guarded by a shared
 * secret rather than a user role so it works before any admin UI exists; the
 * endpoint is disabled entirely when the secret is unset.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const secret = process.env.ADMIN_RESOLUTION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { code: "disabled", message: "Resolution is not enabled on this deployment." },
      { status: 404 },
    );
  }

  const presented = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!timingSafeEqual(presented, secret)) {
    return NextResponse.json({ code: "forbidden", message: "Not authorised." }, { status: 403 });
  }

  const parsed = ResolveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { code: "invalid", message: parsed.error.issues[0]?.message ?? "Invalid resolution." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const store = await getPredictionStore();
  const resolved = await store.resolve(id, parsed.data);
  if (!resolved) {
    return NextResponse.json({ code: "not_found", message: "No such forecast." }, { status: 404 });
  }

  return NextResponse.json({
    id: resolved.id,
    resolutionStatus: resolved.resolutionStatus,
    resolvedAt: resolved.resolvedAt,
  });
}

/** Constant-time comparison so the secret can't be probed byte by byte. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
