import { ExternalLink } from "lucide-react";
import type { EvidenceItem as EvidenceItemType } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * The sources behind the forecast, in full.
 *
 * A short list of good sources beats a long list of links, so the engine caps
 * this and orders by relevance × reliability. Nothing here is ever generated:
 * an item without a URL is a placeholder in the sample forecast and says so,
 * rather than borrowing a real publisher's name to look complete.
 */
export function EvidenceList({ evidence }: { evidence: EvidenceItemType[] }) {
  if (evidence.length === 0) {
    return <p className="text-sm text-muted">No sources were retained for this forecast.</p>;
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      {evidence.map((item) => (
        <EvidenceItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

export function EvidenceItem({ item }: { item: EvidenceItemType }) {
  const published = formatDate(item.publishedAt);
  const linked = item.url.startsWith("http");

  const meta = (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-faint">
      <span className="text-muted">{item.sourceName}</span>
      {published ? (
        <>
          <span aria-hidden>·</span>
          <time dateTime={item.publishedAt ?? undefined}>{published}</time>
        </>
      ) : null}
      <span aria-hidden>·</span>
      <span>{reliabilityLabel(item.reliability)}</span>
    </p>
  );

  // Placeholder slot in the sample forecast: no headline is invented and there
  // is nothing to click, so it renders as plain text rather than a dead link.
  if (!linked) {
    return (
      <li className="py-4">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-faint">{item.title}</p>
        {meta}
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>
      </li>
    );
  }

  return (
    <li className="py-4">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group block rounded-md"
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[15px] font-medium leading-snug text-ink group-hover:text-cobalt">
            {item.title}
          </p>
          <ExternalLink
            className="mt-0.5 size-3.5 shrink-0 text-faint transition-colors group-hover:text-cobalt"
            aria-hidden
          />
        </div>
        {meta}
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>
      </a>
    </li>
  );
}

function reliabilityLabel(reliability: number): string {
  if (reliability >= 0.85) return "Primary or official";
  if (reliability >= 0.65) return "Established reporting";
  if (reliability >= 0.4) return "Secondary coverage";
  return "Low-confidence source";
}
