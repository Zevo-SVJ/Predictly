import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/marketing/Footer";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ForecastResult as ForecastResultView } from "@/components/ForecastResult";
import { ShareForecast } from "@/components/ShareForecast";
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
      <MarketingNav />
      <main id="main" className="container-page pb-16 pt-24 sm:pb-20 sm:pt-32">
        <ForecastResultView forecast={forecast} />

        <section className="mt-14 border-t border-border pt-10 sm:mt-16">
          <h2 className="eyebrow">Share this forecast</h2>
          <ShareForecast forecast={forecast} className="mt-5" />
        </section>

        <div className="mt-14 border-t border-border pt-8">
          <p className="text-sm text-muted">Curious about something else?</p>
          <Link
            href="/predict"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-cobalt px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep"
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
