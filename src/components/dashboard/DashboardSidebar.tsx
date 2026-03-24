import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Settings,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { DashboardSection } from "../../types/dashboard";

interface NavItem {
  section: DashboardSection;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { section: "overview", label: "Overview", icon: LayoutDashboard },
  { section: "schedule", label: "Schedule", icon: CalendarDays },
  { section: "billing", label: "Billing", icon: CreditCard },
  { section: "settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  currentSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  onGoHome: () => void;
  isAdmin?: boolean;
  className?: string;
}

export default function DashboardSidebar({
  currentSection,
  onNavigate,
  onGoHome,
  isAdmin = false,
  className = "",
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  return (
    <aside
      className={`dashboard-sidebar flex flex-col border-r border-slate-800 ${className}`}
    >
      <div className="border-b border-slate-800 px-5 pb-4 pt-6">
        <button
          type="button"
          onClick={onGoHome}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-lg font-black text-orange-300 shadow-[0_10px_24px_rgba(249,115,22,0.28)]">
            HD
          </span>
          <span className="font-['Bebas_Neue'] text-3xl tracking-[0.1em] text-white">
            PRO<span className="text-orange-400">CARE</span>
          </span>
        </button>
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Control Center
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 p-3">
        {NAV_ITEMS.map(({ section, label, icon: Icon }) => {
          const isActive =
            currentSection === section ||
            (section === "overview" &&
              (currentSection === "subscription-detail" ||
               currentSection === "subscriptions" ||
               currentSection === "properties" ||
               currentSection === "referrals"));

          return (
            <button
              key={section}
              type="button"
              onClick={() => onNavigate(section)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] transition-all cursor-pointer ${
                isActive
                  ? "border border-orange-500/40 bg-orange-500/15 text-orange-300 shadow-[0_12px_26px_rgba(249,115,22,0.2)]"
                  : "border border-transparent text-slate-400 hover:border-slate-700/80 hover:bg-slate-900/70 hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-orange-500/20 text-orange-300"
                    : "bg-slate-800/80 text-slate-500 group-hover:text-slate-200"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      {isAdmin && (
        <div className="mx-3 mb-2">
          <button
            type="button"
            onClick={() => void navigate("/admin")}
            className="group flex w-full items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/15 cursor-pointer"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-300">
              <Shield size={16} />
            </span>
            <span className="truncate">Admin Panel</span>
          </button>
        </div>
      )}

      <div className="m-3 rounded-xl border border-slate-800 bg-slate-900/75 px-3 py-2.5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">System Status</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
          Monitoring Active
        </p>
      </div>
    </aside>
  );
}
