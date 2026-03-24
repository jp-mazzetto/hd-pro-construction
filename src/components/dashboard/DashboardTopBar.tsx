import { LogOut, Menu } from "lucide-react";

import type { AuthSession } from "../../types/auth";

interface DashboardTopBarProps {
  session: AuthSession;
  title: string;
  onLogout: () => void;
  onMenuToggle: () => void;
}

export default function DashboardTopBar({
  session,
  title,
  onLogout,
  onMenuToggle,
}: DashboardTopBarProps) {
  const initials = session.actor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="dashboard-topbar z-10 flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-xl border border-slate-700 p-2 text-slate-400 hover:border-slate-500 hover:bg-slate-900 lg:hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-['Bebas_Neue'] text-3xl uppercase tracking-[0.14em] text-white sm:text-4xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 lg:flex">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {formattedDate}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/15 text-xs font-bold text-orange-300">
            {initials}
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
            {session.actor.name}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300 cursor-pointer"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
