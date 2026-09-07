import { Globe, MessageSquare, Percent, Scale } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    title: "Ask about an event",
    body: "One question, in plain language. No categories, no model settings, no research options.",
  },
  {
    icon: Globe,
    title: "Predictly researches the web",
    body: "It writes its own search queries — official positions, recent reporting, and evidence against the obvious answer.",
  },
  {
    icon: Scale,
    title: "Evidence is weighed",
    body: "Each source is judged on reliability, relevance and how recent it is. Weak and duplicated sources count for less.",
  },
  {
    icon: Percent,
    title: "You get a probability",
    body: "The number comes from aggregating that evidence against a base rate — not from asking a model to pick a percentage.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
          How Predictly gets to a number
        </h2>

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-muted">
                  <step.icon className="size-4" aria-hidden />
                </span>
                <span className="font-mono text-xs text-faint">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
