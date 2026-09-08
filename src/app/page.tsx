import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LandingViewTracker } from "@/components/LandingViewTracker";
import { LiveDemo } from "@/components/LiveDemo";
import { Navbar } from "@/components/Navbar";
import { OnTheRadar } from "@/components/OnTheRadar";
import { PredictField } from "@/components/PredictField";
import { TrustStrip } from "@/components/TrustStrip";
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
 * Six sections, each earning its place.
 *
 * Hero states the offer and hands over the product. The radar is the only
 * discovery rail. The field shows breadth as one composition. The demo runs the
 * real backend once — the page's single product demonstration. Then one compact
 * explanation and the invitation back to the input.
 */
export default function HomePage() {
  // A single question for the live demo: one prominent example at a time.
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
        <TrustStrip />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
