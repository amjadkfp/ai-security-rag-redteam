import { FileText, ExternalLink } from "lucide-react";
import { projectDocs } from "../data/docs";

const statusStyle: Record<string, string> = {
  done: "text-emerald-400",
  "in-progress": "text-amber-300",
  "not-started": "text-silver-500",
};

const statusLabel: Record<string, string> = {
  done: "Done",
  "in-progress": "In progress",
  "not-started": "Not started",
};

const REPO = "https://github.com/amjadkfp/ai-security-rag-redteam/blob/main";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-silver-100">Reports &amp; documentation</h1>
        <p className="mt-3 max-w-2xl text-silver-300">
          Every phase is written up in the repo as it's completed. Links open the source markdown
          on GitHub.
        </p>
      </div>

      <div className="divide-y divide-navy-600 border border-navy-600 bg-navy-900/60">
        {projectDocs.map((doc) => (
          <a
            key={doc.file}
            href={`${REPO}/${doc.file}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 px-5 py-4 hover:bg-navy-800/50"
          >
            <FileText className="h-5 w-5 shrink-0 text-cyan-500" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-silver-500">Phase {doc.phase}</span>
                <h3 className="font-display text-sm text-silver-100">{doc.title}</h3>
              </div>
              <p className="mt-1 truncate text-xs text-silver-500">{doc.summary}</p>
            </div>
            <span className={`shrink-0 font-mono text-xs ${statusStyle[doc.status]}`}>
              {statusLabel[doc.status]}
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-silver-500" />
          </a>
        ))}
      </div>
    </div>
  );
}
