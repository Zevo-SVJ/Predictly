"use client";

import { useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { track } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Email magic link plus Google, both through Supabase.
 *
 * Authentication is never in the way of a first forecast — this screen is only
 * reached when someone wants to keep one.
 */
export function LoginForm({ next = "/history" }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  if (!supabase) {
    return (
      <div className="rounded-[var(--radius-md)] border border-border bg-canvas p-5">
        <p className="text-sm font-medium text-ink">Accounts aren&apos;t configured</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Set <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable
          sign-in. Forecasting works without them.
        </p>
      </div>
    );
  }

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      : undefined;

  async function handleEmail(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setStatus("sending");
    setMessage(null);
    track("signup_started", { method: "email" });

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  async function handleGoogle() {
    if (!supabase) return;
    track("signup_started", { method: "google" });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setStatus("error");
      setMessage(
        error.message.includes("provider")
          ? "Google sign-in isn't enabled on this Supabase project yet."
          : error.message,
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-md)] border border-border bg-canvas p-5">
        <p className="flex items-center gap-2 text-sm font-medium text-cobalt">
          <Check className="size-4" aria-hidden />
          Check your inbox
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We sent a sign-in link to <span className="text-ink">{email}</span>. Open it on this
          device to finish.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleEmail} className="space-y-3">
        <label htmlFor="email" className="block text-sm text-muted">
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-border-strong bg-white px-5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-cobalt"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cobalt px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep disabled:opacity-70"
        >
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Mail className="size-4" aria-hidden />
          )}
          Send me a sign-in link
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-faint">
        <span className="h-px flex-1 bg-line" aria-hidden />
        or
        <span className="h-px flex-1 bg-line" aria-hidden />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-canvas"
      >
        <GoogleMark />
        Continue with Google
      </button>

      {message ? (
        <p role="alert" className="text-sm text-counters">
          {message}
        </p>
      ) : null}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
      />
    </svg>
  );
}
