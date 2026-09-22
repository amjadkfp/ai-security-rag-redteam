import { Link2, ExternalLink } from "lucide-react";
import { Panel } from "../components/Panel";

export default function About() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-silver-100">About this project</h1>
        <p className="mt-3 text-silver-300">
          I'm a cybersecurity student with no prior AI/ML background, building this project to
          break into entry-level AI security roles — AI Red Teamer, ML Security Engineer, LLM
          Security Analyst. I wanted hands-on experience with how LLM-based applications actually
          fail, and how to defend against them, using the same frameworks real security teams
          reference.
        </p>
      </div>

      <Panel title="Why this project">
        <p className="text-sm text-silver-300">
          Tyndex Lab is a fictional AI/cybersecurity training organization built as a target: a
          RAG chatbot backed by 18 internal policy documents, deliberately shipped with no
          authentication, no role-based access control, and no output filtering. That baseline
          makes the failure modes visible, reproducible, and — after Phase 4 — measurably fixable.
        </p>
      </Panel>

      <Panel title="Contact">
        <div className="flex flex-col gap-3 text-sm">
          <a
            href="https://github.com/amjadkfp/ai-security-rag-redteam"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-silver-300 hover:text-cyan-400"
          >
            <Link2 className="h-4 w-4" /> github.com/amjadkfp/ai-security-rag-redteam
          </a>
          <a
            href="https://www.linkedin.com/in/amjad-khaleel-farhan-97290b228/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-silver-300 hover:text-cyan-400"
          >
            <ExternalLink className="h-4 w-4" /> Amjad Khaleel Farhan
          </a>
        </div>
      </Panel>
    </div>
  );
}
