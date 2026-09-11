import Link from "next/link";
import { ArrowRight, CircleSlash, CheckCircle2, XCircle } from "lucide-react";
import { Footer } from "@/components/marketing/Footer";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { isSupabaseConfigured } from "@/lib/config";
import { getPredictionStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/supabase/server";
import type { ForecastResult } from "@/lib/types";
import { formatDate, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My predictions",
  description: "Every forecast you've saved, with its probability and resolution status.",
};

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">My predictions</h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          {isSupabaseConfigured()
            ? "Sign in to see the forecasts you've saved."
            : "Accounts need Supabase configured. Add the environment variables to enable sign-in and saved predictions."}
        </p>
        {isSupabaseConfigured() ? (
          <Link
            href="/login?next=/history"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-cobalt px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep"
          >
            Sign in
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : null}
      </Shell>
    );
  }

  const store = await getPredictionStore();
  const forecasts = await store.listByUser(user.id);

  return (
    <Shell>
      <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">My predictions</h1>
      <p className="mt-3 text-sm text-muted">
        {forecasts.length === 0
          ? "Nothing saved yet."
          : `${forecasts.length} saved forecast${forecasts.length === 1 ? "" : "s"}.`}
      </p>

      {forecasts.length === 0 ? (
        <Link
          href="/predict"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-cobalt px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep"
        >
          Make your first prediction
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {forecasts.map((forecast) => (
            <HistoryRow key={forecast.id} forecast={forecast} />
          ))}
        </ul>
      )}
    </Shell>
  );
}

function HistoryRow({ forecast }: { forecast: ForecastResult }) {
  const headline =
    forecast.outcomes.find((o) => o.id === forecast.headlineOutcomeId) ?? forecast.outcomes[0];

  return (
    <li>
      <Link
        href={`/predict/${forecast.id}`}
        className="group flex items-center gap-5 py-5 sm:gap-8"
      >
        <span className="w-16 shrink-0 text-2xl font-semibold tabular-nums tracking-tight text-cobalt sm:w-20 sm:text-3xl">
          {formatPercent(forecast.probability)}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium text-ink group-hover:text-cobalt">
            {forecast.question}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <span className="uppercase tracking-wider">{headline?.label}</span>
            <span aria-hidden>·</span>
            <span>{forecast.category}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(forecast.createdAt)}</span>
          </span>
        </span>

        <ResolutionChip forecast={forecast} />
      </Link>
    </li>
  );
}

function ResolutionChip({ forecast }: { forecast: ForecastResult }) {
  const config = {
    unresolved: { icon: null, label: "Open", className: "text-muted" },
    correct: { icon: CheckCircle2, label: "Correct", className: "text-supports" },
    wrong: { icon: XCircle, label: "Wrong", className: "text-counters" },
    cancelled: { icon: CircleSlash, label: "Cancelled", className: "text-muted" },
  }[forecast.resolutionStatus];

  const Icon = config.icon;
  return (
    <span className={`hidden shrink-0 items-center gap-1.5 text-xs sm:inline-flex ${config.className}`}>
      {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
      {config.label}
    </span>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main id="main" className="mx-auto min-h-[60vh] max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
