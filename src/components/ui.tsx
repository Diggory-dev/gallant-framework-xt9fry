import React from "react";

export const cn = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export const Card: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

export const Panel: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <section
    className={cn(
      "rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-slate-100",
      className
    )}
  >
    {children}
  </section>
);

export type Tone = "info" | "success" | "warning" | "neutral" | "purple";
export const Badge: React.FC<
  React.PropsWithChildren<{ tone?: Tone; className?: string }>
> = ({ children, tone = "info", className }) => {
  const t: Record<Tone, string> = {
    info: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    neutral: "bg-slate-50 text-slate-700 ring-1 ring-slate-100",
    purple: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        t[tone],
        className
      )}
    >
      {children}
    </span>
  );
};

export const Progress: React.FC<{ value: number }> = ({ value }) => (
  <div className="h-1.5 w-full rounded-full bg-slate-200">
    <div
      className="h-1.5 rounded-full bg-emerald-500"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);