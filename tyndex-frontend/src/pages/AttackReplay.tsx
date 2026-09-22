import { useState } from "react";
import { AlertTriangle, Loader2, PlayCircle } from "lucide-react";
import { api, ApiUnavailableError, type AttackReplayResponse } from "../api/client";
import { findings } from "../data/findings";
import { Panel } from "../components/Panel";
import { SeverityTag, OwaspTag } from "../components/Badges";

const steps = ["Query", "Retrieved Document", "Constructed Prompt", "Model Response", "Finding", "Mitigation", "Retest"];

export default function AttackReplay() {
  const [findingId, setFindingId] = useState(findings[0].id);
  const [mode, setMode] = useState<"vulnerable" | "hardened">("vulnerable");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AttackReplayResponse | null>(null);

  const finding = findings.find((f) => f.id === findingId)!;

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.attackReplay({ finding_id: findingId, mode });
      setResult(res);
    } catch (err) {
      if (err instanceof ApiUnavailableError) {
        setError("Backend not reachable. Start the FastAPI backend to replay this attack against the live system.");
      } else {
        setError(err instanceof Error ? err.message : "Request failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-xs text-cyan-500">INTERACTIVE</div>
        <h1 className="mt-2 font-display text-3xl text-silver-100">Attack replay</h1>
        <p className="mt-3 max-w-2xl text-silver-300">
          Re-run a documented finding against the live backend and step through exactly what the
          system did — query, retrieval, constructed prompt, response, and how the hardened mode
          compares.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="font-mono text-[11px] text-silver-500">FINDING</div>
          <select
            value={findingId}
            onChange={(e) => setFindingId(Number(e.target.value))}
            className="mt-1.5 w-full border border-navy-600 bg-navy-950 px-3 py-2.5 text-sm text-silver-100"
          >
            {findings.map((f) => (
              <option key={f.id} value={f.id}>
                #{f.id} — {f.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="font-mono text-[11px] text-silver-500">MODE</div>
          <div className="mt-1.5 flex gap-2">
            <button
              onClick={() => setMode("vulnerable")}
              className={`flex-1 border px-3 py-2.5 text-sm ${mode === "vulnerable" ? "border-red-400/50 bg-red-400/10 text-red-400" : "border-navy-600 text-silver-500"}`}
            >
              Vulnerable
            </button>
            <button
              onClick={() => setMode("hardened")}
              className={`flex-1 border px-3 py-2.5 text-sm ${mode === "hardened" ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" : "border-navy-600 text-silver-500"}`}
            >
              Hardened
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <OwaspTag id={finding.owasp} />
        <SeverityTag severity={finding.severity} />
        <button
          onClick={run}
          disabled={loading}
          className="ml-auto flex items-center gap-2 border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
          Run replay
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-silver-500">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={result ? "text-cyan-400" : ""}>{s}</span>
            {i < steps.length - 1 && <span>→</span>}
          </span>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-3 border border-amber-300/30 bg-amber-300/5 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {!result && !error && (
        <Panel title="Payload (from documented finding)" eyebrow="STATIC — NOT YET RUN">
          <pre className="whitespace-pre-wrap border border-navy-600 bg-navy-950 p-3 font-mono text-xs text-silver-300">
            {finding.payload}
          </pre>
        </Panel>
      )}

      {result && (
        <div className="space-y-4">
          <Panel title="Retrieved document" eyebrow="STEP 2">
            <span className="border border-navy-600 bg-navy-800 px-2 py-0.5 font-mono text-xs text-silver-300">
              {result.retrieved_document}
            </span>
          </Panel>
          <Panel title="Constructed prompt" eyebrow="STEP 3">
            <pre className="whitespace-pre-wrap border border-navy-600 bg-navy-950 p-3 font-mono text-xs text-silver-300">
              {result.constructed_prompt}
            </pre>
          </Panel>
          <Panel title="Model response" eyebrow={`STEP 4 · ${result.mode.toUpperCase()}`}>
            <p className="whitespace-pre-wrap text-sm text-silver-100">{result.model_response}</p>
          </Panel>
        </div>
      )}
    </div>
  );
}
