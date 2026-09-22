import type { Severity, FindingStatus } from "../data/findings";

const severityColor: Record<Severity, string> = {
  Critical: "text-red-400 border-red-400/40 bg-red-400/10",
  High: "text-orange-400 border-orange-400/40 bg-orange-400/10",
  Medium: "text-amber-300 border-amber-300/40 bg-amber-300/10",
  Low: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10",
  Informational: "text-silver-500 border-silver-500/40 bg-silver-500/10",
};

export function SeverityTag({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-xs ${severityColor[severity]}`}
    >
      {severity}
    </span>
  );
}

const statusColor: Record<FindingStatus, string> = {
  Open: "text-red-400",
  Closed: "text-emerald-400",
  Partial: "text-amber-300",
};

export function StatusTag({ status }: { status: FindingStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${statusColor[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full status-glow bg-current" />
      {status}
    </span>
  );
}

export function OwaspTag({ id }: { id: string }) {
  return (
    <span className="rounded-sm border border-cyan-500/30 bg-cyan-500/5 px-2 py-0.5 font-mono text-xs text-cyan-400">
      {id}
    </span>
  );
}

export function AtlasTag({ id }: { id: string }) {
  return (
    <span className="rounded-sm border border-navy-600 bg-navy-800 px-2 py-0.5 font-mono text-xs text-silver-300">
      {id}
    </span>
  );
}
