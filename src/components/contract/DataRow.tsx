import type { ReactNode } from "react";

interface DataRowProps {
  label: string;
  value: ReactNode;
}

export default function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}
