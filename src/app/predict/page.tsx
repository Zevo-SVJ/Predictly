import { Suspense } from "react";
import { PredictionStage } from "@/components/PredictionStage";
import { Footer } from "@/components/marketing/Footer";
import { MarketingNav } from "@/components/marketing/MarketingNav";

export const metadata = {
  title: "Make a prediction",
  description:
    "Ask about any future event. Predictly researches the latest evidence and gives you a probability-based forecast.",
};

/**
 * The same stage as the homepage, without the page underneath it.
 *
 * Arriving with `?q=` starts the run immediately — that is how a shared link
 * lands here. There is deliberately no second implementation of the flow.
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
      <MarketingNav />
      <main id="main">
        <Suspense fallback={null}>
          {/* Keyed by the question so arriving with a new ?q= starts a fresh run. */}
          <PredictionStage
            key={question || "idle"}
            initialQuestion={question || undefined}
            returnPath="/predict"
            variant="app"
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
