import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div
      className={`dashboard-stat-card relative rounded-xl p-6 bg-[#171f33] border-l-4 ${
        accent ? "border-[#ffb690]" : "border-[#93ccff]"
      }`}
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="font-['Manrope'] text-4xl font-extrabold leading-none text-white">{value}</p>
      <div
        className={`absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl ${
          accent
            ? "bg-orange-500/12 text-[#ffb690]"
            : "bg-[#93ccff]/12 text-[#93ccff]"
        }`}
      >
        {icon}
      </div>
    </div>
  );
}
