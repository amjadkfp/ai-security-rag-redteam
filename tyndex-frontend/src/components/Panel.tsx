import type { ReactNode } from "react";

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-navy-600 bg-navy-900/60 ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-navy-600 px-5 py-3.5">
          <div>
            {eyebrow && (
              <div className="font-mono text-[11px] tracking-wide text-cyan-500/80">{eyebrow}</div>
            )}
            {title && <h3 className="font-display text-base text-silver-100">{title}</h3>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatBlock({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-navy-600 bg-navy-900/60 p-5">
      <div className="font-mono text-[11px] text-silver-500">{label}</div>
      <div className="mt-2 font-display text-3xl text-silver-100">{value}</div>
      {sub && <div className="mt-1 text-xs text-silver-500">{sub}</div>}
    </div>
  );
}
