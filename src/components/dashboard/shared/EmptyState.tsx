import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="dashboard-card flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-slate-500">
        {icon}
      </div>
      <h3 className="mb-1 font-['Bebas_Neue'] text-3xl tracking-[0.08em] text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-xs uppercase tracking-[0.12em] text-slate-400">{description}</p>
      {action}
    </div>
  );
}
