import Link from "next/link";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-4 py-20 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">404</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Nothing to forecast here
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          This forecast doesn&apos;t exist, or it was never saved. Predictions made
          before Supabase is configured only live for the life of the server.
        </p>
        <Link
          href="/predict"
          className="mt-8 inline-flex w-fit rounded-full bg-cobalt px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep"
        >
          Make a prediction
        </Link>
      </main>
      <Footer />
    </>
  );
}
