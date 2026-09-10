import { LandingViewTracker } from "@/components/LandingViewTracker";
import { PredictionStage } from "@/components/PredictionStage";
import { Comparison } from "@/components/landing/Comparison";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { ForecastExample } from "@/components/landing/ForecastExample";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { InAction } from "@/components/landing/InAction";
import { Navbar } from "@/components/landing/Navbar";
import { ResearchDemo } from "@/components/landing/ResearchDemo";
import { Reviews } from "@/components/landing/Reviews";

export const revalidate = 3600;

export const metadata = {
  title: "Predictly — Predict what happens next",
  description:
    "Ask about any real-world event that hasn't happened yet. Predictly researches the latest evidence, weighs every source it finds, and turns it into a probability.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Predictly — Predict what happens next",
    description:
      "Ask about a future event. Predictly researches the evidence and turns it into a probability you can check.",
    url: "/",
  },
};

/**
 * The landing page.
 *
 * `PredictionStage` is the hero and also the whole flow: submitting a question
 * does not navigate anywhere, it turns this page into the forecast. Everything
 * passed as children below is what a visitor sees *before* they ask, and it is
 * unmounted the moment they do.
 *
 * The order is one argument told once, and the shapes deliberately alternate so
 * no two adjacent sections read the same way: the product itself, then the
 * research behind it on a tinted band, then its result set directly on white
 * with no card at all, then the four steps as one bordered strip, then the
 * whole thing again on a live event, then the honest state of our social proof,
 * a comparison, the objections, and the same input the page opened with.
 */
export default function HomePage() {
  return (
    <>
      <LandingViewTracker />
      <Navbar />

      <main id="main">
        <PredictionStage>
          <ResearchDemo />
          <ForecastExample />
          <HowItWorks />
          <InAction />
          <Reviews />
          <Comparison />
          <FAQ />
          <FinalCTA />
        </PredictionStage>
      </main>

      <Footer />
    </>
  );
}
