import type { DirectionStatus } from "@/projects";

const styles: Record<DirectionStatus, string> = {
  Shipped: "bg-accent text-on-accent",
  Partly: "bg-accent-soft text-fg",
  Designed: "border border-accent/50 text-fg",
  "Not built": "border border-line text-muted",
  Cut: "border border-dashed border-line text-muted",
};

/** What happened to a direction in the end, as a small pill. */
export function Status({ status }: { status: DirectionStatus }) {
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${styles[status]}`}>{status}</span>;
}
