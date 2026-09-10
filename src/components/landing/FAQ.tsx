import { FAQAccordion, type FaqEntry } from "../product/FAQAccordion";

/**
 * The questions a sceptical first-time visitor actually has.
 *
 * The accuracy answer refuses to give a figure on purpose. There isn't one yet,
 * and quoting a number before enough forecasts have resolved would be marketing
 * dressed as measurement.
 */
const ENTRIES: FaqEntry[] = [
  {
    q: "What does Predictly actually predict?",
    a: "Anything that will clearly either happen or not, and that the open web is currently writing about — a title race, a product launch, an election, a release date, a regulatory approval, a price threshold. If a question is too vague to ever be settled, Predictly says so instead of producing a number for it.",
  },
  {
    q: "Where does Predictly get its information?",
    a: "From the live web, at the moment you ask. It searches, follows what it finds, and reads the actual article text rather than a search snippet. Duplicates and syndicated copies of the same story collapse into a single source, so ten reprints of one wire story count once rather than ten times.",
  },
  {
    q: "How does Predictly calculate probabilities?",
    a: "Each source is scored on four things: which outcome it points to and how strongly, how reliable the publisher is, how relevant it is to your exact question, and how recently it was written. Those multiply into one weight per source, and the weights are aggregated against a base rate in log-odds space. It is deterministic — the same evidence produces the same number every time.",
  },
  {
    q: "Doesn't it just ask an AI for a number?",
    a: "That is the one thing it does not do. A language model is used twice: to work out what your question is really asking, and to judge each source it reads. It is never asked what the probability is. Handing that step to a model is what makes most AI forecasting impossible to check, because there is nothing behind the number to inspect.",
  },
  {
    q: "What does the probability actually mean?",
    a: "That out of many situations that look like this one, Predictly expects the event to happen about that often. A 70% forecast that does not come true is not automatically wrong — three in ten of them are supposed to miss. What would be wrong is a run of 70% calls landing far less than seven times in ten.",
  },
  {
    q: "What is confidence, and how is it different?",
    a: "Probability is about the event. Confidence is about the forecast: how many usable sources there were, how reliable they were, how recent, and how much they agreed. A 50/50 call built on five recent primary sources is high-confidence; an 80% call built on two stale posts is not. Both numbers are shown, always.",
  },
  {
    q: "How recent is the research?",
    a: "It runs when you ask — there is no cached answer waiting. The date each source was published is recorded and fed into the weighting, so older material still counts but counts less, and a forecast resting entirely on old evidence is capped at medium confidence no matter how unanimous it is.",
  },
  {
    q: "Does Predictly guarantee its predictions?",
    a: "No, and any forecasting product that says otherwise is selling something else. A probability is a description of uncertainty. Predictly's job is to make the reasoning behind that number inspectable — every source, every weight — so you can disagree with it on the evidence rather than on faith.",
  },
  {
    q: "Are my predictions public?",
    a: "A forecast gets a shareable link so you can send it to someone, and anyone with that link can read it. It is not listed, indexed in a public feed or attached to your name unless you share it yourself.",
  },
  {
    q: "How accurate is it?",
    a: "We don't publish an accuracy figure, because not enough forecasts have resolved for one to mean anything yet. Every forecast is stored with a resolution field from the first day, so when there is a real track record it will be counted rather than claimed.",
  },
  {
    q: "Can I ask about sports, technology and politics?",
    a: "Yes, and anything else with a resolvable outcome. Predictly doesn't have a fixed list of categories — it works out the domain from the question itself, and its limit is whether current, credible sources exist to read.",
  },
  {
    q: "Is Predictly a betting platform?",
    a: "No. There is no wager, no stake, no market, no payout and no counterparty. Predictly does not take bets, does not connect to anyone who does, and does not tell you what to do with a forecast. It is a research tool that ends in a probability.",
  },
  {
    q: "Can I save my forecasts?",
    a: "Yes. You can ask, watch the research run and read the result without an account; signing in exists so the forecasts you want to keep stay in one place and can be checked against what actually happened.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-y scroll-mt-24 bg-canvas">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
              Common questions.
            </h2>
          </div>

          <FAQAccordion entries={ENTRIES} />
        </div>
      </div>
    </section>
  );
}
