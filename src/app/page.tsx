import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LandingViewTracker } from "@/components/LandingViewTracker";
import { Navbar } from "@/components/Navbar";
import { PredictionResult } from "@/components/PredictionResult";
import { ShareCard } from "@/components/ShareCard";
import { EXAMPLE_FORECAST } from "@/lib/data/example-forecast";
import { SITE } from "@/lib/config";

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
};

export default function HomePage() {
  return (
    <>
      <LandingViewTracker />
      <Navbar />

      <main id="main">
        <Hero />
        <HowItWorks />

        {/* Demonstrate the product rather than describing it. */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-faint">Example forecast</p>
                <h2 className="mt-3 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
                  This is what you get back
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-faint">
                A worked example on a real open question, with real sources.
                Hand-written for this page — run your own to see live research.
              </p>
            </div>

            <div className="mt-12 rounded-card border border-line bg-surface p-5 sm:p-10">
              <PredictionResult forecast={EXAMPLE_FORECAST} showActions={false} />
            </div>
          </div>
        </section>

        {/* Share card preview — the artefact that travels. */}
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="max-w-md text-3xl font-semibold leading-tight sm:text-4xl">
                Every forecast gets a link worth sharing
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                Each prediction has its own page with the probability, the
                reasoning and every source behind it — so anyone you send it to
                can check the work instead of taking your word for it.
              </p>
              <Link
                href="/predict"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-lime hover:text-lime-dim"
              >
                Make a prediction
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="max-w-xl lg:justify-self-end">
              <ShareCard forecast={EXAMPLE_FORECAST} />
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
              What are you curious about?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              One question is all it takes. No account needed to start.
            </p>
            <Link
              href="/predict"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-[15px] font-medium text-lime-ink transition-colors hover:bg-lime-dim"
            >
              Make a prediction
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
