/**
 * The Forecast Signal Field — the hero's atmosphere.
 *
 * Fragments of information drifting slowly through a system: category labels,
 * evidence markers, stray probabilities, hairline connectors. Deliberately not
 * a chart. The previous background was a moving line graph, which made a
 * forecasting product read as a trading terminal.
 *
 * Every fragment is a fixed, hand-authored position with a negative animation
 * delay, so the field is already populated on first paint and the markup is
 * identical on server and client. One transform per element, no canvas, no
 * per-frame JavaScript, and the whole layer is hidden from assistive tech.
 */
interface Fragment {
  text: string;
  /** Vertical position, % of the field. */
  top: number;
  /** Seconds for one full crossing. Slower reads as calmer. */
  duration: number;
  /** Negative offset into the cycle, so fragments start spread across. */
  delay: number;
  size: number;
  opacity: number;
  accent?: boolean;
}

const FRAGMENTS: Fragment[] = [
  { text: "SPORTS", top: 8, duration: 190, delay: -12, size: 11, opacity: 0.16 },
  { text: "82%", top: 15, duration: 150, delay: -95, size: 13, opacity: 0.2, accent: true },
  { text: "· · ·", top: 21, duration: 240, delay: -40, size: 10, opacity: 0.12 },
  { text: "EVIDENCE", top: 27, duration: 165, delay: -130, size: 10, opacity: 0.14 },
  { text: "TECHNOLOGY", top: 34, duration: 205, delay: -60, size: 11, opacity: 0.13 },
  { text: "[ SIGNAL ]", top: 41, duration: 145, delay: -20, size: 10, opacity: 0.18 },
  { text: "SCIENCE", top: 47, duration: 225, delay: -150, size: 11, opacity: 0.12 },
  { text: "RESEARCH", top: 53, duration: 175, delay: -78, size: 10, opacity: 0.15 },
  { text: "41%", top: 59, duration: 195, delay: -35, size: 12, opacity: 0.16, accent: true },
  { text: "POLITICS", top: 65, duration: 155, delay: -110, size: 11, opacity: 0.13 },
  { text: "FORECAST", top: 71, duration: 235, delay: -55, size: 10, opacity: 0.14 },
  { text: "—", top: 77, duration: 180, delay: -140, size: 14, opacity: 0.1 },
  { text: "CULTURE", top: 83, duration: 210, delay: -25, size: 11, opacity: 0.12 },
  { text: "67%", top: 89, duration: 160, delay: -88, size: 12, opacity: 0.17, accent: true },
  { text: "MARKETS", top: 12, duration: 260, delay: -170, size: 10, opacity: 0.11 },
  { text: "[ 2026 ]", top: 44, duration: 200, delay: -185, size: 10, opacity: 0.13 },
  { text: "ENTERTAINMENT", top: 62, duration: 250, delay: -200, size: 10, opacity: 0.11 },
  { text: "· · ·", top: 30, duration: 170, delay: -100, size: 10, opacity: 0.12 },
];

export function SignalField() {
  return (
    // Masked so fragments are faintest behind the copy on the left and only
    // gain presence in the open space to the right — atmosphere, never
    // competition with the headline.
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 34%, #000 62%, #000 100%)",
      }}
      aria-hidden
    >
      {FRAGMENTS.map((fragment, index) => (
        <span
          key={index}
          className={`animate-signal absolute left-full whitespace-nowrap font-mono tracking-[0.22em] ${
            fragment.accent ? "text-lime" : "text-fg"
          }`}
          style={{
            top: `${fragment.top}%`,
            fontSize: `${fragment.size}px`,
            opacity: fragment.opacity,
            ["--signal-duration" as string]: `${fragment.duration}s`,
            ["--signal-delay" as string]: `${fragment.delay}s`,
          }}
        >
          {fragment.text}
        </span>
      ))}
    </div>
  );
}
