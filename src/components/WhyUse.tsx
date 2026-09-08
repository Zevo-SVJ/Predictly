import { Reveal } from "./Reveal";

/**
 * Three motivations, set as editorial blocks rather than an icon grid.
 * Each is numbered and rules off, so the section reads as a sequence of
 * arguments instead of a row of equal cards.
 */
const REASONS = [
  {
    title: "Know what's coming",
    body: "Understand where a story is actually heading, with the evidence that points there — not a summary of what already happened.",
  },
  {
    title: "Test your own thesis",
    body: "You already have a hunch. Ask the question, and compare your intuition against what the current record supports.",
  },
  {
    title: "Follow what matters",
    body: "Save a forecast and come back to it. As new information lands, the picture changes — and you can see how much.",
  },
];

export function WhyUse() {
  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="container-canvas">
        <Reveal>
          <h2
            className="max-w-[20ch] font-semibold leading-[0.92] tracking-[-0.045em]"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Why people use Predictly
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-14 gap-y-12 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 0.07}>
              <div className="border-t border-line pt-7">
                <p className="font-mono text-[11px] tracking-[0.2em] text-lime">
                  0{index + 1}
                </p>
                <h3 className="mt-5 text-[1.6rem] font-semibold leading-[1.05] tracking-[-0.03em]">
                  {reason.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{reason.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
