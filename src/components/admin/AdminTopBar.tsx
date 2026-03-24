import { Home, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { AuthSession } from "../../types/auth";

interface AdminTopBarProps {
  session: AuthSession;
  onLogout: () => void;
}

export default function AdminTopBar({ session, onLogout }: AdminTopBarProps) {
  const navigate = useNavigate();

  const initials = session.actor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="dashboard-topbar z-10 flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void navigate("/")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300 hover:border-slate-500 hover:bg-slate-900 cursor-pointer"
        >
          <Home size={14} />
          <span className="hidden sm:inline">Home</span>
        </button>

        <div className="flex items-center gap-2">
          <h1 className="font-['Bebas_Neue'] text-3xl uppercase tracking-[0.14em] text-white sm:text-4xl">
            Admin Panel
          </h1>
          <span className="flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300">
            <Shield size={11} />
            Admin
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 lg:flex">
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
