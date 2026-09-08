import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LandingViewTracker } from "@/components/LandingViewTracker";
import { Navbar } from "@/components/Navbar";
import { TrendingSection } from "@/components/TrendingSection";
import { WhyTheForecast } from "@/components/WhyTheForecast";
import { SITE } from "@/lib/config";

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <LandingViewTracker />
      <Navbar />

      <main id="main">
        <Hero />
        <TrendingSection />
        <HowItWorks />
        <WhyTheForecast />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
