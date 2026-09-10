import { LandingViewTracker } from "@/components/LandingViewTracker";
import { PredictionStage } from "@/components/PredictionStage";
import { Comparison } from "@/components/landing/Comparison";
import { Evidence } from "@/components/landing/Evidence";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { SecondaryForecast } from "@/components/landing/SecondaryForecast";
import { TrendingRail } from "@/components/landing/TrendingRail";
import { TwoNumbers } from "@/components/landing/TwoNumbers";
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
 * Nine scenes, each one large object and one idea, in the order a sceptic would
 * ask for them: the forecast itself, a rail of questions that are genuinely
 * open, what a forecast is built on, how it is built, the same machine on a
 * different subject, the two numbers every forecast carries, where Predictly
 * sits against the things it gets mistaken for, the objections, and the
 * composer the page opened with.
 *
 * There are exactly two forecast examples on the page. A grid of a dozen says
 * "look how many categories we have"; two say "look what one answer contains".
 * There is no testimonials section, because there are no testimonials.
 */
export default function HomePage() {
  return (
    <>
      <LandingViewTracker />
      <Navbar />

      <main id="main">
        <PredictionStage>
          <TrendingRail />
          <Evidence />
          <HowItWorks />
          <SecondaryForecast />
          <TwoNumbers />
          <Comparison />
          <FAQ />
          <FinalCTA />
        </PredictionStage>
      </main>

      <Footer />
    </>
  );
}
