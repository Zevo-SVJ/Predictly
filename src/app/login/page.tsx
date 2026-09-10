import { redirect } from "next/navigation";
import { Footer } from "@/components/landing/Footer";
import { LoginForm } from "@/components/LoginForm";
import { Navbar } from "@/components/landing/Navbar";
import { getCurrentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in",
  description: "Sign in to save and revisit your Predictly forecasts.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Only ever redirect within this app — never to an attacker-supplied origin.
  const safeNext = typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/history";

  if (await getCurrentUser()) redirect(safeNext);

  return (
    <>
      <Navbar />
      <main id="main" className="mx-auto min-h-[70vh] max-w-md px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="text-3xl font-semibold leading-tight">Save your forecasts</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Predicting is free and needs no account. Sign in only to keep your
          predictions and follow how they resolve.
        </p>

        <div className="mt-9">
          <LoginForm next={safeNext} />
        </div>
      </main>
      <Footer />
    </>
  );
}
