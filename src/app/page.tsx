import { CategoryWall } from "@/components/CategoryWall";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { FutureFeed } from "@/components/FutureFeed";
import { Hero } from "@/components/Hero";
import { LandingViewTracker } from "@/components/LandingViewTracker";
import { LiveDemo } from "@/components/LiveDemo";
import { Navbar } from "@/components/Navbar";
import { NotAGuess } from "@/components/NotAGuess";
import { Statement } from "@/components/Statement";
import { TrendingSection } from "@/components/TrendingSection";
import { SITE } from "@/lib/config";
import { getTrendingEvents } from "@/lib/trending";

/**
 * Statically rendered for LCP, regenerated every five minutes so the discovery
 * feed picks up forecasts made since the last build. When Supabase is
 * configured the store reads cookies, which makes the route dynamic anyway.
 */
export const revalidate = 300;

export const metadata = {
  title: `${SITE.name} — Predict what happens next.`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage narrative: a claim, the questions people are asking, what is
 * worth predicting, proof the number is earned, the product itself, the brand
 * statement, the breadth, and the invitation.
 *
 * Each section is composed differently on purpose — display type, then a
 * ticker, then a dense feed, then an interactive split, then the live product —
 * so the page has rhythm instead of a repeating card motif.
 */
export default function HomePage() {
  const demoQuestions = getTrendingEvents().slice(0, 3);

  return (
    <>
      <LandingViewTracker />
      <Navbar />

      <main id="main">
        <Hero />
        <TrendingSection />
        <FutureFeed />
        <NotAGuess />
        <LiveDemo questions={demoQuestions} />
        <Statement />
        <CategoryWall />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
