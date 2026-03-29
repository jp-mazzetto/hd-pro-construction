import { Bell, LogOut, Menu, Settings } from "lucide-react";

import type { AuthSession } from "../../types/auth";
import type { DashboardSection } from "../../types/dashboard";

interface DashboardTopBarProps {
  session: AuthSession;
  title: string;
  onLogout: () => void;
  onMenuToggle: () => void;
  onNavigate: (section: DashboardSection) => void;
}

export default function DashboardTopBar({
  session,
  title,
  onLogout,
  onMenuToggle,
  onNavigate,
}: DashboardTopBarProps) {
  const initials = session.actor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="dashboard-topbar z-10 flex items-center justify-between border-b border-slate-800 px-4 py-4 sm:px-6">
      {/* Left: hamburger (mobile) + section title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-xl border border-slate-700 p-2 text-slate-400 hover:border-slate-600 hover:bg-slate-800/60 hover:text-white lg:hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
      </div>

      {/* Right: date + icons + user + logout */}
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-slate-400 lg:inline">{formattedDate}</span>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/60 hover:text-orange-400 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("settings")}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/60 hover:text-orange-400 cursor-pointer"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="hidden items-center gap-3 border-l border-slate-800 pl-4 lg:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/35 bg-orange-500/15 text-xs font-bold text-orange-300">
            {initials}
          </div>
          <span className="text-sm font-semibold text-slate-200">
            {session.actor.name}
          </span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:border-orange-500/35 hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
