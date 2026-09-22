import { useState, type FormEvent } from "react";
import { Send, AlertTriangle, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { api, ApiUnavailableError, type ChatResponse } from "../api/client";
import { Panel } from "../components/Panel";

export default function LiveDemo() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"vulnerable" | "hardened">("vulnerable");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChatResponse | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.chat({ query, mode });
      setResult(res);
    } catch (err) {
      if (err instanceof ApiUnavailableError) {
        setError(
          "Backend not reachable at the configured API URL. Start it with: uvicorn backend.main:app --reload"
        );
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
        <div className="font-mono text-xs text-cyan-500">LIVE</div>
        <h1 className="mt-2 font-display text-3xl text-silver-100">Live RAG demo</h1>
        <p className="mt-3 max-w-2xl text-silver-300">
          Talks directly to your existing Python RAG engine through the FastAPI backend — the same{" "}
          <code className="font-mono text-cyan-400">chat.py</code> retrieval and generation logic,
          no separate chatbot.
        </p>
      </div>

      <div className="flex gap-2">
        <ModeButton active={mode === "vulnerable"} onClick={() => setMode("vulnerable")} icon={ShieldAlert} label="Vulnerable (v1)" tone="red" />
        <ModeButton active={mode === "hardened"} onClick={() => setMode("hardened")} icon={ShieldCheck} label="Hardened (v2)" tone="cyan" />
      </div>

      <Panel>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask the assistant a question, e.g. “What's the refund policy?”"
            className="flex-1 border border-navy-600 bg-navy-950 px-4 py-2.5 text-sm text-silver-100 placeholder:text-silver-500 focus:border-cyan-500/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </form>
      </Panel>

      {error && (
        <div className="flex items-start gap-3 border border-amber-300/30 bg-amber-300/5 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div>{error}</div>
            <div className="mt-1 text-xs text-amber-200/70">
              See <code className="font-mono">backend/README.md</code> for setup — this UI does not
              fall back to fabricated responses.
            </div>
          </div>
        </div>
      )}

      {result && (
        <Panel eyebrow={`MODE: ${result.mode.toUpperCase()} · ${result.model}`} title="Response">
          <p className="whitespace-pre-wrap text-sm text-silver-100">{result.answer}</p>
          <div className="mt-4 border-t border-navy-600 pt-4">
            <div className="font-mono text-[11px] text-silver-500">RETRIEVED FROM</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {result.retrieved_sources.map((s) => (
                <span key={s} className="border border-navy-600 bg-navy-800 px-2 py-0.5 font-mono text-xs text-silver-300">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-2 font-mono text-[11px] text-silver-500">{result.latency_ms}ms</div>
          </div>
        </Panel>
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon: Icon,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof ShieldAlert;
  label: string;
  tone: "red" | "cyan";
}) {
  const toneClass =
    tone === "red"
      ? "border-red-400/50 bg-red-400/10 text-red-400"
      : "border-cyan-500/50 bg-cyan-500/10 text-cyan-400";
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border px-3.5 py-2 text-sm ${
        active ? toneClass : "border-navy-600 text-silver-500 hover:border-silver-500"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
