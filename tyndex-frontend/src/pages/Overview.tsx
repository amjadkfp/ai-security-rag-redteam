import { Link } from "react-router-dom";
import { ArrowRight, FileText, ShieldAlert, Link2, Hammer, Crosshair, Search, ShieldCheck, CheckCircle2 } from "lucide-react";
import { findingsSummary } from "../data/findings";
import { StatBlock } from "../components/Panel";

const stages = [
  { icon: Hammer, label: "Build", detail: "RAG target system, 18-document knowledge base" },
  { icon: Crosshair, label: "Attack", detail: "Manual adversarial testing against the live system" },
  { icon: Search, label: "Investigate", detail: "Automated scanning with garak + promptfoo" },
  { icon: ShieldCheck, label: "Harden", detail: "Layered mitigations, hardened system prompt" },
  { icon: CheckCircle2, label: "Retest", detail: "Identical attack suite re-run, before/after compared" },
];

export default function Overview() {
  return (
    <div className="space-y-10">
      <div className="border border-navy-600 bg-navy-900/40 p-8 lg:p-10">
        <div className="font-mono text-xs text-cyan-500">TYNDEX LAB · RAG RED TEAM LAB</div>
        <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-silver-100 lg:text-5xl">
          Attack. Analyze. Harden. Verify.
        </h1>
        <p className="mt-4 max-w-xl text-silver-300">
          An offensive and defensive security assessment of the Tyndex Lab AI Student &amp; IT
          Assistant — a retrieval-augmented chatbot built as a deliberately vulnerable target,
          mapped end to end against the OWASP Top 10 for LLM Applications and MITRE ATLAS.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/architecture" className="flex items-center gap-2 border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/20">
            Explore Lab <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/findings" className="flex items-center gap-2 border border-navy-600 px-4 py-2 text-sm text-silver-300 hover:border-silver-500">
            <ShieldAlert className="h-4 w-4" /> View Findings
          </Link>
          <Link to="/reports" className="flex items-center gap-2 border border-navy-600 px-4 py-2 text-sm text-silver-300 hover:border-silver-500">
            <FileText className="h-4 w-4" /> Read Report
          </Link>
          <a href="https://github.com/amjadkfp/ai-security-rag-redteam" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-navy-600 px-4 py-2 text-sm text-silver-300 hover:border-silver-500">
            <Link2 className="h-4 w-4" /> GitHub
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatBlock label="KNOWLEDGE BASE" value={18} sub="fictional internal documents" />
        <StatBlock label="MANUAL FINDINGS" value={findingsSummary.total} sub={`${findingsSummary.critical} critical`} />
        <StatBlock label="OPEN" value={findingsSummary.open} sub="pending mitigation" />
        <StatBlock label="OWASP CATEGORIES HIT" value={3} sub="of 10 tracked" />
      </div>

      <div>
        <h2 className="font-display text-lg text-silver-100">Assessment pipeline</h2>
        <div className="mt-4 grid grid-cols-1 gap-px border border-navy-600 bg-navy-600 sm:grid-cols-5">
          {stages.map(({ icon: Icon, label, detail }, i) => (
            <div key={label} className="bg-navy-900 p-5">
              <div className="font-mono text-[11px] text-silver-500">0{i + 1}</div>
              <Icon className="mt-2 h-5 w-5 text-cyan-400" strokeWidth={1.75} />
              <div className="mt-3 font-display text-sm text-silver-100">{label}</div>
              <div className="mt-1 text-xs text-silver-500">{detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-navy-600 bg-navy-900/60 p-6">
          <h3 className="font-display text-base text-silver-100">Project status</h3>
          <p className="mt-2 text-sm text-silver-300">
            Target system and manual findings are complete. Automated scanning, mitigations, and
            final retesting are in progress — results shown as demo data are clearly labeled until
            replaced with real scanner output.
          </p>
        </div>
        <div className="border border-navy-600 bg-navy-900/60 p-6">
          <h3 className="font-display text-base text-silver-100">Frameworks referenced</h3>
          <p className="mt-2 text-sm text-silver-300">
            Every finding is mapped to an OWASP Top 10 for LLM Applications category and a MITRE
            ATLAS technique ID — the same references real security teams and job postings use.
          </p>
        </div>
      </div>
    </div>
  );
}
