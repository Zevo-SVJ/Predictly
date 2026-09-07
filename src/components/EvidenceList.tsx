import { ExternalLink } from "lucide-react";
import type { EvidenceItem as EvidenceItemType } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * Sources behind the forecast. A short list of good sources beats a long list
 * of links, so the engine caps this and orders by relevance × reliability.
 */
export function EvidenceList({ evidence }: { evidence: EvidenceItemType[] }) {
  if (evidence.length === 0) {
    return (
      <p className="text-sm text-muted">
        No sources were retained for this forecast.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {evidence.map((item) => (
        <EvidenceItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

export function EvidenceItem({ item }: { item: EvidenceItemType }) {
  const published = formatDate(item.publishedAt);
  const external = item.url.startsWith("http");

  return (
    <li className="py-4">
      <a
        href={item.url}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer nofollow" : undefined}
        className="group block rounded-md"
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[15px] font-medium leading-snug text-fg group-hover:text-lime">
            {item.title}
          </p>
          <ExternalLink
            className="mt-0.5 size-3.5 shrink-0 text-faint transition-colors group-hover:text-lime"
            aria-hidden
          />
        </div>

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
