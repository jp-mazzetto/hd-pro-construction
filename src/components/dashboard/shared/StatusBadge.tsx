const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "border-emerald-400/35 bg-emerald-500/15 text-emerald-300",
  PAID: "border-emerald-400/35 bg-emerald-500/15 text-emerald-300",
  COMPLETED: "border-emerald-400/35 bg-emerald-500/15 text-emerald-300",
  PENDING: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  SCHEDULED: "border-sky-400/40 bg-blue-500/15 text-sky-300",
  CANCELLED: "border-red-400/45 bg-red-500/15 text-red-300",
  END_SCHEDULED: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  EXPIRED: "border-slate-400/30 bg-gray-500/15 text-slate-300",
  OVERDUE: "border-red-400/45 bg-red-500/15 text-red-300",
  WAIVED: "border-fuchsia-400/40 bg-purple-500/15 text-fuchsia-300",
  RESCHEDULED: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  SKIPPED: "border-slate-400/30 bg-gray-500/15 text-slate-300",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "border-slate-400/30 bg-gray-500/15 text-slate-300";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${style} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {status === "END_SCHEDULED" ? "Cancels at end" : status.replace("_", " ")}
    </span>
  );
}
