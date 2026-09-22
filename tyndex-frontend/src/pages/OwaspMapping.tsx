import { Link } from "react-router-dom";
import { owaspTop10 } from "../data/owasp";
import { findings } from "../data/findings";
import { OwaspTag, SeverityTag } from "../components/Badges";

export default function OwaspMapping() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-silver-100">OWASP LLM Top 10 + MITRE ATLAS</h1>
        <p className="mt-3 max-w-2xl text-silver-300">
          Every finding in this assessment is mapped to an OWASP Top 10 for LLM Applications
          category and a MITRE ATLAS technique ID, the same reference frameworks security teams
          use to communicate LLM risk in a shared vocabulary.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {owaspTop10.map((cat) => {
          const hits = findings.filter((f) => cat.findingIds.includes(f.id));
          return (
            <div key={cat.id} className="border border-navy-600 bg-navy-900/60 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <OwaspTag id={cat.id} />
                <h3 className="font-display text-base text-silver-100">{cat.name}</h3>
                {hits.length > 0 && (
                  <span className="ml-auto font-mono text-xs text-cyan-400">
                    {hits.length} finding{hits.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-silver-300">{cat.summary}</p>
              {hits.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {hits.map((f) => (
                    <Link
                      key={f.id}
                      to="/findings"
                      className="flex items-center gap-2 border border-navy-600 px-2.5 py-1 text-xs text-silver-300 hover:border-cyan-500/50 hover:text-cyan-400"
                    >
                      #{f.id} {f.title}
                      <SeverityTag severity={f.severity} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
