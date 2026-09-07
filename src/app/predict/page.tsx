import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PredictFlow } from "@/components/PredictFlow";

export const metadata = {
  title: "Make a prediction",
  description:
    "Ask about any future event. Predictly researches the latest information and gives you a probability-based forecast.",
};

/**
 * The forecasting surface. Arriving with `?q=` (from the hero or a trending
 * pill) starts the run immediately; otherwise the user is asked here.
 */
export default async function PredictPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const question = typeof q === "string" ? q.slice(0, 240).trim() : undefined;

  return (
    <>
      <Navbar />
      <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <Suspense fallback={null}>
          {/* Keyed by the question so arriving with a new ?q= starts a fresh run. */}
          <PredictFlow key={question || "idle"} initialQuestion={question || undefined} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
