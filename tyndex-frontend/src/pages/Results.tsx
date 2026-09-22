import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AlertTriangle } from "lucide-react";
import { api, ApiUnavailableError } from "../api/client";
import { Panel, StatBlock } from "../components/Panel";
import { findingsSummary, findings } from "../data/findings";

// Demo data only — Phase 3/4 have not produced real scanner output yet.
// This block is replaced automatically once /api/results returns real data.
const DEMO_CATEGORY_DATA = [
  { category: "Prompt Injection", pre: 0, post: 0 },
  { category: "Jailbreak", pre: 0, post: 0 },
  { category: "Data Leakage", pre: 0, post: 0 },
  { category: "Indirect Injection", pre: 0, post: 0 },
];

export default function Results() {
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .results()
      .then(() => setBackendConnected(true))
      .catch((e) => setBackendConnected(!(e instanceof ApiUnavailableError) ? true : false));
  }, []);

  const severityCounts = ["Critical", "High", "Medium", "Low", "Informational"].map((sev) => ({
    severity: sev,
    count: findings.filter((f) => f.severity === sev).length,
  })).filter((d) => d.count > 0);

  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono text-xs text-cyan-500">PHASE 3 + 4</div>
        <h1 className="mt-2 font-display text-3xl text-silver-100">Before / after results</h1>
        <p className="mt-3 max-w-2xl text-silver-300">
          Pass rates from the identical garak + promptfoo suite, run against the system before and
          after mitigations.
        </p>
      </div>

      {backendConnected === false && (
        <div className="flex items-center gap-3 border border-amber-300/30 bg-amber-300/5 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Backend not reachable — showing demo data only. Start the FastAPI backend and re-run the
          scanner suite to populate this page with real results.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatBlock label="MANUAL FINDINGS" value={findingsSummary.total} />
        <StatBlock label="CRITICAL" value={findingsSummary.critical} />
        <StatBlock label="AUTOMATED TESTS RUN" value="—" sub="Phase 3 not yet run" />
        <StatBlock label="POST-MITIGATION RETEST" value="—" sub="Phase 4 not yet run" />
      </div>

      <Panel
        title="Pass rate by category — pre vs. post mitigation"
        eyebrow="DEMO DATA — REPLACE WITH ACTUAL SCANNER RESULTS"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEMO_CATEGORY_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#161d2e" />
              <XAxis dataKey="category" stroke="#8a94a8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#8a94a8" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ background: "#0a0e17", border: "1px solid #1f2940", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="pre" name="Pre-mitigation" fill="#f87171" />
              <Bar dataKey="post" name="Post-mitigation" fill="#22c1ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Manual findings by severity" eyebrow="ACTUAL DATA">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityCounts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#161d2e" horizontal={false} />
              <XAxis type="number" stroke="#8a94a8" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="severity" stroke="#8a94a8" tick={{ fontSize: 11 }} width={100} />
              <Tooltip contentStyle={{ background: "#0a0e17", border: "1px solid #1f2940", fontSize: 12 }} />
              <Bar dataKey="count" fill="#22c1ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
