import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Network,
  TerminalSquare,
  Replace,
  ShieldAlert,
  BarChart3,
  ListChecks,
  Grid3x3,
  FileText,
  Info,
  ShieldHalf,
  Link2,
} from "lucide-react";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/live-demo", label: "Live RAG Demo", icon: TerminalSquare },
  { to: "/attack-replay", label: "Attack Replay", icon: Replace },
  { to: "/findings", label: "Findings", icon: ShieldAlert },
  { to: "/results", label: "Before / After", icon: BarChart3 },
  { to: "/methodology", label: "Methodology", icon: ListChecks },
  { to: "/mapping", label: "OWASP + ATLAS", icon: Grid3x3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/about", label: "About", icon: Info },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-navy-600 bg-navy-950/95 lg:flex">
        <div className="flex items-center gap-2.5 border-b border-navy-600 px-5 py-5">
          <ShieldHalf className="h-6 w-6 text-cyan-400" strokeWidth={1.75} />
          <div>
            <div className="font-display text-sm font-semibold leading-tight text-silver-100">TYNDEX LAB</div>
            <div className="font-mono text-[10px] leading-tight text-silver-500">RAG Red Team</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-cyan-400 bg-cyan-400/5 text-silver-100"
                    : "border-transparent text-silver-500 hover:border-navy-600 hover:bg-navy-800/60 hover:text-silver-300"
                }`
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
        <a
          href="https://github.com/amjadkfp/ai-security-rag-redteam"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 border-t border-navy-600 px-5 py-4 text-xs text-silver-500 hover:text-cyan-400"
        >
          <Link2 className="h-4 w-4" strokeWidth={1.75} />
          github.com/amjadkfp
        </a>
      </aside>

      <div className="flex-1 lg:pl-60">
        <TopBar />
        <main className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-navy-600 bg-navy-950/90 px-6 py-3 backdrop-blur lg:px-10">
      <div className="flex items-center gap-2 lg:hidden">
        <ShieldHalf className="h-5 w-5 text-cyan-400" />
        <span className="font-display text-sm text-silver-100">TYNDEX LAB</span>
      </div>
      <div className="hidden font-mono text-xs text-silver-500 lg:block">
        Attack. Analyze. Harden. Verify.
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-silver-500">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300 status-glow" />
        Phase 2 of 5 — manual findings in progress
      </div>
    </div>
  );
}
