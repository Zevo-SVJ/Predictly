import { getFeedback } from "@/lib/feedback";

/**
 * Editorial feedback composition: one large lead quote with the others offset
 * beneath it, rather than a symmetrical three-card grid.
 *
 * Renders nothing at all when there is no real feedback — which is the current
 * state. An empty section is honest; invented quotes are not.
 */
export function Feedback() {
  const entries = getFeedback();
  if (entries.length === 0) return null;

  const [lead, ...rest] = entries;
  if (!lead) return null;

  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="container-content">
        <h2 className="eyebrow">People are already asking it</h2>

        <figure className="mt-10 max-w-[26ch] sm:mt-14">
          <blockquote
            className="font-semibold leading-[1.08] tracking-[-0.035em]"
            style={{ fontSize: "var(--text-h2)" }}
          >
            &ldquo;{lead.quote}&rdquo;
          </blockquote>
          <Attribution entry={lead} />
        </figure>

        {rest.length > 0 ? (
          <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:mt-20 sm:grid-cols-2 sm:gap-16 lg:pl-[28%]">
            {rest.slice(0, 2).map((entry) => (
              <figure key={entry.id}>
                <blockquote className="text-[16px] leading-relaxed text-muted">
                  &ldquo;{entry.quote}&rdquo;
                </blockquote>
                <Attribution entry={entry} />
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Attribution({ entry }: { entry: ReturnType<typeof getFeedback>[number] }) {
  return (
    <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-fg">
        {entry.name}
      </span>
      {entry.role ? <span className="eyebrow">{entry.role}</span> : null}
      {entry.handle ? <span className="eyebrow">{entry.handle}</span> : null}
      {entry.askedAbout ? (
        <span className="eyebrow">Asked about {entry.askedAbout}</span>
      ) : null}
    </figcaption>
  );
}
