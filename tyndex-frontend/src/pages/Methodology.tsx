import { Panel } from "../components/Panel";

const checklist = [
  "Direct prompt injection — override system instructions",
  "Indirect prompt injection — instruction planted in retrieved document",
  "Jailbreak — roleplay/hypothetical framing to bypass refusal",
  "System prompt exfiltration",
  "Sensitive data exfiltration from knowledge base",
  "Excessive agency test (if any tool/action access exists)",
];

export default function Methodology() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-silver-100">Methodology</h1>
        <p className="mt-3 max-w-2xl text-silver-300">
          Manual testing first, to build understanding of why an attack works — then automation,
          for repeatable and quantifiable coverage that can be re-run against the hardened system
          to prove mitigations actually work.
        </p>
      </div>

      <Panel eyebrow="PHASE 2" title="Manual attack checklist">
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-silver-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              {item}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel eyebrow="PHASE 3" title="Automated scanning tools">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border border-navy-600 bg-navy-950 p-4">
            <div className="font-mono text-sm text-cyan-400">garak</div>
            <p className="mt-1 text-xs text-silver-400">
              Probe-based LLM vulnerability scanner — runs structured attack probes (e.g.
              promptinject, dan, leakreplay) against the target endpoint.
            </p>
          </div>
          <div className="border border-navy-600 bg-navy-950 p-4">
            <div className="font-mono text-sm text-cyan-400">promptfoo</div>
            <p className="mt-1 text-xs text-silver-400">
              Adversarial eval framework — YAML-defined test cases scored across prompt injection,
              jailbreak, and data-leakage categories.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-silver-500">
          Not yet run — status tracked on the Reports page. Results will populate here once
          <code className="mx-1 font-mono text-cyan-400">results/pre-mitigation/</code> and
          <code className="mx-1 font-mono text-cyan-400">results/post-mitigation/</code> contain
          real scanner output.
        </p>
      </Panel>

      <Panel eyebrow="PHASE 4" title="Mitigation layers">
        <ol className="space-y-3 text-sm text-silver-300">
          <li><span className="font-mono text-cyan-400">01</span> — System prompt hardening: explicit refusal instructions, delimiter-based separation of instructions vs. retrieved content</li>
          <li><span className="font-mono text-cyan-400">02</span> — Input/output guardrails: a classifier checking requests and responses before and after the LLM call</li>
          <li><span className="font-mono text-cyan-400">03</span> — Retrieval sanitization: detecting and stripping instruction-like text in retrieved chunks before they enter the prompt</li>
        </ol>
      </Panel>
    </div>
  );
}
