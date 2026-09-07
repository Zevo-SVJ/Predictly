"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 sm:px-6">
      <h1 className="text-3xl font-semibold leading-tight">Something went wrong</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        That&apos;s on us. Try again — if it keeps happening, the forecast you asked
        for may be hitting a provider issue.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 w-fit rounded-full bg-lime px-5 py-2.5 text-sm font-medium text-lime-ink transition-colors hover:bg-lime-dim"
      >
        Try again
      </button>
    </main>
  );
}
