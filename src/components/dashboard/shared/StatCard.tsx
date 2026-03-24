import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className="dashboard-stat-card rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
            accent
              ? "border-orange-500/40 bg-orange-500/15 text-orange-300"
              : "border-slate-700 bg-slate-800 text-slate-400"
          }`}
        >
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </span>
      </div>
      <div className="font-['Bebas_Neue'] text-4xl leading-none tracking-[0.04em] text-white">
        {value}
      </div>
    </div>
  );
}
