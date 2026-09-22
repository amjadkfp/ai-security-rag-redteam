import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { findings, type Severity, type FindingStatus } from "../data/findings";
import { SeverityTag, StatusTag, OwaspTag, AtlasTag } from "../components/Badges";

const severities: Severity[] = ["Critical", "High", "Medium", "Low", "Informational"];
const statuses: FindingStatus[] = ["Open", "Closed", "Partial"];

export default function Findings() {
  const [severityFilter, setSeverityFilter] = useState<Severity | "All">("All");
  const [statusFilter, setStatusFilter] = useState<FindingStatus | "All">("All");
  const [openId, setOpenId] = useState<number | null>(1);

  const filtered = useMemo(
    () =>
      findings.filter(
        (f) =>
          (severityFilter === "All" || f.severity === severityFilter) &&
          (statusFilter === "All" || f.status === statusFilter)
      ),
    [severityFilter, statusFilter]
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-xs text-cyan-500">PHASE 2</div>
        <h1 className="mt-2 font-display text-3xl text-silver-100">Security findings</h1>
        <p className="mt-3 max-w-2xl text-silver-300">
          Five manual adversarial attacks run against the live v1 system, sourced from{" "}
          <code className="font-mono text-cyan-400">docs/02-manual-findings.md</code>.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 border border-navy-600 bg-navy-900/60 p-4">
        <FilterGroup label="Severity" value={severityFilter} options={severities} onChange={setSeverityFilter} />
        <FilterGroup label="Status" value={statusFilter} options={statuses} onChange={setStatusFilter} />
      </div>

      <div className="space-y-3">
        {filtered.map((f) => {
          const open = openId === f.id;
          return (
            <div key={f.id} className="border border-navy-600 bg-navy-900/60">
              <button
                onClick={() => setOpenId(open ? null : f.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-silver-500">#{f.id}</span>
                    <OwaspTag id={f.owasp} />
                    <AtlasTag id={f.atlas} />
                    <SeverityTag severity={f.severity} />
                    <StatusTag status={f.status} />
                  </div>
                  <h3 className="mt-2 truncate font-display text-base text-silver-100">{f.title}</h3>
                </div>
                <ChevronDown className={`h-5 w-5 shrink-0 text-silver-500 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="space-y-5 border-t border-navy-600 px-5 py-5">
                  <Field label="Description">{f.description}</Field>

                  <Field label="Reproduction steps">
                    <ol className="list-decimal space-y-1 pl-5 text-sm text-silver-300">
                      {f.reproSteps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </Field>

                  <Field label="Payload used">
                    <pre className="whitespace-pre-wrap border border-navy-600 bg-navy-950 p-3 font-mono text-xs text-silver-300">
                      {f.payload}
                    </pre>
                  </Field>

                  <Field label="Observed response">
                    <pre className="whitespace-pre-wrap border border-amber-300/30 bg-amber-300/5 p-3 font-mono text-xs text-amber-200/80">
                      {f.observedResponse}
                    </pre>
                  </Field>

                  <Field label="Impact">{f.impact}</Field>
                  <Field label="Recommended fix">{f.fix}</Field>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="border border-navy-600 bg-navy-900/60 p-8 text-center text-sm text-silver-500">
            No findings match these filters.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | "All";
  options: T[];
  onChange: (v: T | "All") => void;
}) {
  return (
    <div>
      <div className="font-mono text-[11px] text-silver-500">{label.toUpperCase()}</div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {(["All", ...options] as (T | "All")[]).map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`border px-2.5 py-1 text-xs ${
              value === opt
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                : "border-navy-600 text-silver-500 hover:border-silver-500 hover:text-silver-300"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] text-silver-500">{label.toUpperCase()}</div>
      <div className="mt-1.5 text-sm text-silver-300">{children}</div>
    </div>
  );
}
