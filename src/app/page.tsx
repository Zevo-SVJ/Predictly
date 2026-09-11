import { LandingViewTracker } from "@/components/LandingViewTracker";
import { PredictionStage } from "@/components/PredictionStage";
import { Comparison } from "@/components/marketing/Comparison";
import { FAQ } from "@/components/marketing/FAQ";
import { FeatureCards } from "@/components/marketing/FeatureCards";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { PredictionExamples } from "@/components/marketing/PredictionExamples";

export const revalidate = 3600;

export const metadata = {
  title: "Predictly — Predict what happens next",
  description:
    "Ask about any real-world event that hasn't happened yet. Predictly researches the evidence, weighs every source it finds, and turns it into a probability.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Predictly — Predict what happens next",
    description:
      "Ask about a future event. Predictly researches the evidence and turns it into a probability you can check.",
    url: "/",
  },
};

/**
 * The marketing page.
 *
 * `PredictionStage` is the hero and also the whole flow: submitting a question
 * does not navigate anywhere, it turns this page into the forecast. Everything
 * passed as children is what a visitor sees *before* they ask, and it is
 * unmounted the moment they do.
 *
 * Six scenes, each one idea: three cards showing what the product does, three
 * cards showing how, six answers showing what you can ask, a comparison with
 * the thing it gets mistaken for, the objections, and the action the page
 * opened with. There is no testimonials section, because there are no
 * testimonials.
 */
export default function HomePage() {
  return (
    <>
      <LandingViewTracker />
      <MarketingNav />

      <main id="main">
        <PredictionStage>
          <FeatureCards />
          <HowItWorks />
          <PredictionExamples />
          <Comparison />
          <FAQ />
          <FinalCTA />
        </PredictionStage>
      </main>

      <Footer />
    </>
  );
}
