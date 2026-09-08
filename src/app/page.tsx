import { Discover } from "@/components/Discover";
import { Faq } from "@/components/Faq";
import { Feedback } from "@/components/Feedback";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { ForecastMoment } from "@/components/ForecastMoment";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LandingViewTracker } from "@/components/LandingViewTracker";
import { LiveDemo } from "@/components/LiveDemo";
import { Navbar } from "@/components/Navbar";
import { OnTheRadar } from "@/components/OnTheRadar";
import { PredictField } from "@/components/PredictField";
import { ResearchLayer } from "@/components/ResearchLayer";
import { WhyUse } from "@/components/WhyUse";
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
 * The page answers, in order: what is this, what can I ask it, what does using
 * it look like, where does the number come from, why should I trust it, why
 * would I use it, how does it work, what else is here, what do I still want to
 * know, and what do I do now.
 *
 * The rhythm alternates on purpose — atmosphere, a fast full-bleed rail, an
 * interactive canvas, the real product, a dense research table, a large figure,
 * editorial blocks, a ruled diagram, a feed, prose, and the invitation — so no
 * two adjacent sections share a shape.
 *
 * `Feedback` renders nothing until real feedback exists.
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
        <ResearchLayer />
        <ForecastMoment />
        <WhyUse />
        <HowItWorks />
        <Discover />
        <Feedback />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
