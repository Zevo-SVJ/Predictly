import { Reveal } from "./Reveal";

const VERBS = [
  { verb: "Researches", body: "Searches recent reporting, official statements and primary sources." },
  { verb: "Compares", body: "Removes duplicate coverage so ten copies of one story count once." },
  { verb: "Weighs", body: "Scores each source on reliability, relevance and how recent it is." },
  { verb: "Estimates", body: "Aggregates that evidence against a base rate to produce the number." },
];

/**
 * The credibility argument, stated plainly: the probability is arithmetic over
 * evidence, not a language model's opinion. This is the section that earns the
 * user's trust in the number, so it is typography, not decoration.
 */
export function WhyTheForecast() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-[2rem] font-semibold leading-[1.08] sm:text-[2.75rem]">
                Predictly doesn&apos;t
                <br />
                just guess.
              </h2>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
                Asking a model to name a percentage produces a number with
                nothing behind it. Predictly builds the number from the sources
                it found, and shows you every one of them.
              </p>
            </div>
          </Reveal>

          <ul>
            {VERBS.map((item, index) => (
              <Reveal key={item.verb} delay={index * 0.06}>
                <li className="grid grid-cols-1 gap-1.5 border-t border-line py-6 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:py-7">
                  <h3 className="text-lg font-medium">{item.verb}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
