import { Reveal } from "./Reveal";

/**
 * Answers written to be true rather than reassuring.
 *
 * In particular the accuracy answer makes no claim, because Predictly has no
 * track record yet, and the betting answer is unambiguous — that distinction
 * matters more than any feature on this page.
 *
 * Native <details> so it works without JavaScript and is keyboard-operable by
 * default; no accordion library, no ARIA to get wrong.
 */
const QUESTIONS = [
  {
    q: "What is Predictly?",
    a: "A forecasting tool. You ask about a future event, Predictly researches what is currently known about it, and returns a probability with the evidence behind it.",
  },
  {
    q: "How does Predictly make a forecast?",
    a: "It works out what the question is really asking and what the possible outcomes are, searches the web for current evidence, scores each source on relevance, credibility and recency, then aggregates those scores against a base rate. The probability is arithmetic over the evidence, not a number a language model was asked to pick.",
  },
  {
    q: "Where does the research come from?",
    a: "Live web search at the moment you ask, weighted toward primary sources, official statements and established reporting. Every source is listed with the forecast so you can check the work.",
  },
  {
    q: "Can I ask about any future event?",
    a: "Anything with an outcome that can be objectively settled and, ideally, a date. Predictly will decline questions that are opinions, that cannot be resolved, or that have already happened, rather than guess at them.",
  },
  {
    q: "How accurate are the predictions?",
    a: "Predictly has no published track record yet, so there is no accuracy figure to quote and we will not invent one. What you can check today is the reasoning: every forecast shows its sources, the factors on each side, and a confidence rating separate from the probability.",
  },
  {
    q: "Is Predictly a betting platform?",
    a: "No. There is no market, no stake, no odds and no way to place anything. Predictly is a research and forecasting tool, and its output is an estimate of how likely something is — not a recommendation to act on.",
  },
  {
    q: "Can I revisit a prediction later?",
    a: "Yes. Every forecast gets its own page you can share, and saving one to an account keeps it in your history so you can return as the event approaches.",
  },
  {
    q: "Do I need an account to make a prediction?",
    a: "No. Ask a question and you get the forecast. An account is only needed to save one.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line py-16 sm:py-24">
      <div className="container-canvas">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-16">
          <Reveal>
            <h2
              className="font-semibold leading-[0.92] tracking-[-0.045em] lg:sticky lg:top-28"
              style={{ fontSize: "var(--text-h2)" }}
            >
              Questions
            </h2>
          </Reveal>

          <Reveal delay={0.06}>
            <div>
              {QUESTIONS.map((item) => (
                <details key={item.q} className="group border-t border-line">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-[16px] font-medium leading-snug text-fg transition-colors duration-200 hover:text-lime [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      className="mt-1 shrink-0 font-mono text-[15px] text-faint transition-transform duration-300 group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-6 text-[14.5px] leading-relaxed text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
              <div className="border-t border-line" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
