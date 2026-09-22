export interface DocEntry {
  phase: string;
  title: string;
  file: string;
  status: "done" | "in-progress" | "not-started";
  summary: string;
}

export const projectDocs: DocEntry[] = [
  { phase: "00", title: "Foundations", file: "docs/00-foundations.md", status: "in-progress", summary: "Core concepts, OWASP LLM Top 10 and MITRE ATLAS orientation, written in the author's own words." },
  { phase: "01", title: "Architecture", file: "docs/01-architecture.md", status: "done", summary: "Target system design — the intentionally unhardened v1 RAG pipeline and the planted indirect-injection payload." },
  { phase: "02", title: "Manual Findings", file: "docs/02-manual-findings.md", status: "in-progress", summary: "Five hand-run adversarial attacks against the live system, each mapped to OWASP and MITRE ATLAS." },
  { phase: "03", title: "Automated Scan", file: "docs/03-automated-scan.md", status: "not-started", summary: "garak + promptfoo coverage across prompt injection, jailbreak, and data-leakage probes." },
  { phase: "04", title: "Mitigations", file: "docs/04-mitigations.md", status: "not-started", summary: "Hardened system prompt, input/output guardrails, retrieval sanitization, and re-tested pass rates." },
  { phase: "05", title: "Final Report", file: "docs/05-final-report.md", status: "not-started", summary: "Executive summary tying every phase together with before/after results." },
];
