import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PredictionResult } from "@/components/PredictionResult";
import { ShareCard } from "@/components/ShareCard";
import { getPredictionStore } from "@/lib/store";
import type { ForecastResult } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Public prediction pages read straight from the database. */
async function loadForecast(id: string): Promise<ForecastResult | null> {
  const store = await getPredictionStore();
  return store.getById(id);
}

/** Per-forecast metadata so shared links preview with the actual probability. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const forecast = await loadForecast(id);
  if (!forecast) return { title: "Forecast not found" };

  const headline =
    forecast.outcomes.find((o) => o.id === forecast.headlineOutcomeId) ?? forecast.outcomes[0];
  const title = `${formatPercent(forecast.probability)} ${headline?.label ?? ""} — ${forecast.question}`;
  const description = forecast.reasoning.slice(0, 200);

  return {
    title,
    description,
    alternates: { canonical: `/predict/${forecast.id}` },
    openGraph: { title, description, type: "article", url: `/predict/${forecast.id}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Public, shareable forecast page. */
export default async function ForecastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const forecast = await loadForecast(id);
  if (!forecast) notFound();

  return (
    <>
      <Navbar />
      <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <PredictionResult forecast={forecast} />

        {/* Screenshot-ready card. DOM-based on purpose — no image pipeline. */}
        <section className="mx-auto mt-16 max-w-3xl border-t border-line pt-10">
          <h2 className="text-[13px] uppercase tracking-[0.18em] text-faint">Share this forecast</h2>
          <div className="mt-5 max-w-xl">
            <ShareCard forecast={forecast} />
          </div>
        </section>

        <div className="mx-auto mt-14 max-w-3xl border-t border-line pt-8">
          <p className="text-sm text-muted">Curious about something else?</p>
          <Link
            href="/predict"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-medium text-lime-ink transition-colors hover:bg-lime-dim"
          >
            Make a prediction
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
