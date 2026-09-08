import { Feedback } from "@/components/Feedback";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LandingViewTracker } from "@/components/LandingViewTracker";
import { LiveDemo } from "@/components/LiveDemo";
import { Navbar } from "@/components/Navbar";
import { OnTheRadar } from "@/components/OnTheRadar";
import { PredictField } from "@/components/PredictField";
import { SITE } from "@/lib/config";
import { getTrendingEvents } from "@/lib/trending";

export const revalidate = 300;

export const metadata = {
  title: `${SITE.name} — Predict what happens next.`,
  description:
    "Ask about a future event. Predictly researches what's happening now and turns the evidence into a forecast.",
  alternates: { canonical: "/" },
};

/**
 * One environment, entered in sequence — not a feature list.
 *
 * The rhythm alternates deliberately: a large hero, a fast full-bleed ticker,
 * an immersive category canvas, the real product, a quiet explanation, then the
 * invitation. `Feedback` renders nothing until real feedback exists.
 */
export default function HomePage() {
  // One question for the demo: a single prominent example at a time.
  const demoQuestion = getTrendingEvents().slice(0, 1);

  return (
    <>
      <LandingViewTracker />
      <Navbar />

      <main id="main">
        <Hero />
        <OnTheRadar />
        <PredictField />
        <LiveDemo questions={demoQuestion} />
        <HowItWorks />
        <Feedback />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
