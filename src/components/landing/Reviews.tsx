import { Quote } from "lucide-react";

/**
 * Social proof, honestly.
 *
 * Predictly has no users yet, so it has no reviews, and there is no version of
 * inventing three enthusiastic strangers that is worth the credibility it
 * costs. What ships instead is the finished component with its slots visible:
 * when real feedback exists, `REVIEWS` below stops being empty and these
 * placeholders disappear on their own.
 *
 * To go live: fill `REVIEWS` with quotes people actually gave, with their
 * permission. Nothing else needs to change.
 */
interface Review {
  quote: string;
  name: string;
  context: string;
}

/** Real reviews only. Empty until someone has actually said something. */
const REVIEWS: Review[] = [];

const SLOTS = [
  "The first thing someone says about the research",
  "What changed their mind about the number",
  "The question they asked that they couldn't answer anywhere else",
];

export function Reviews() {
  return (
    <section className="section-y bg-canvas">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">What people say</p>
          <h2 className="mt-3 text-[length:var(--text-section)] font-semibold leading-[1.05]">
            {REVIEWS.length > 0 ? "In their words." : "Nothing here yet — on purpose."}
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            {REVIEWS.length > 0
              ? "From people who have used Predictly on questions that mattered to them."
              : "Predictly is new. We could fill this section with quotes nobody said, and plenty of products do. These slots stay empty until real people have used it and told us something worth repeating."}
          </p>
        </div>

        {REVIEWS.length > 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <li
                key={review.name}
                className="rounded-[var(--radius-md)] border border-border bg-white p-5"
              >
                <Quote className="size-4 text-cobalt" aria-hidden />
                <blockquote className="mt-3 text-[15px] leading-relaxed text-ink">
                  {review.quote}
                </blockquote>
                <p className="mt-4 text-[13px] font-medium text-ink">{review.name}</p>
                <p className="text-[12.5px] text-muted">{review.context}</p>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SLOTS.map((slot) => (
              <li
                key={slot}
                className="rounded-[var(--radius-md)] border border-dashed border-border-strong bg-white/60 p-5"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  Empty slot
                </span>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{slot}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
