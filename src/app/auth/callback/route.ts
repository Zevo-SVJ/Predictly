import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Exchanges the Supabase auth code for a session cookie, then returns the user. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  // Open-redirect guard: only same-app paths are honoured.
  const destination =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/history";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=not_configured", url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=exchange_failed", url.origin));
  }

  return NextResponse.redirect(new URL(destination, url.origin));
}
