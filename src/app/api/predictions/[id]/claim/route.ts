import { NextResponse } from "next/server";
import { getPredictionStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Attaches an anonymous forecast to the signed-in user's account. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { code: "unauthenticated", message: "Sign in to save this forecast." },
      { status: 401 },
    );
  }

  const store = await getPredictionStore();
  const claimed = await store.claim(id, user.id);
  if (!claimed) {
    return NextResponse.json(
      { code: "not_found", message: "That forecast can't be saved to your account." },
      { status: 404 },
    );
  }

  return NextResponse.json({ id: claimed.id, userId: claimed.userId });
}
