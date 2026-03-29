import {
  Building2,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

import type { AuthSession } from "../../types/auth";
import type { DashboardSection } from "../../types/dashboard";
import logoImg from "../../assets/imgs/logo.webp";

interface NavItem {
  section: DashboardSection;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { section: "overview",   label: "Dashboard",    icon: LayoutDashboard },
  { section: "properties", label: "My Properties", icon: Building2 },
  { section: "schedule",   label: "Schedule",     icon: CalendarDays },
  { section: "billing",    label: "Billing",       icon: CreditCard },
];

interface DashboardSidebarProps {
  session: AuthSession;
  currentSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  onGoHome: () => void;
  className?: string;
}

export default function DashboardSidebar({
  session,
  currentSection,
  onNavigate,
  onGoHome,
  className = "",
}: DashboardSidebarProps) {
  const initials = session.actor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={`dashboard-sidebar flex flex-col h-screen ${className}`}
    >
      {/* Logo */}
      <div className="px-5 pb-4 pt-6 border-b border-slate-800">
        <button
          type="button"
          onClick={onGoHome}
          className="group flex items-center gap-3 cursor-pointer"
          aria-label="Go to home page"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-500/35 bg-slate-900 shadow-[0_8px_20px_rgba(249,115,22,0.18)]">
            <img
              src={logoImg}
              alt="HD Pro Construction logo"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-['Manrope'] text-base font-extrabold tracking-tight text-white">
            HD Construction
          </span>
        </button>
      </div>

      {/* User profile card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/30 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-500/35 bg-orange-500/15 text-xs font-bold text-orange-300">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{session.actor.name}</p>
            <p className="text-[11px] text-orange-400 font-medium">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-3 pb-3">
        {NAV_ITEMS.map(({ section, label, icon: Icon }) => {
          const isActive =
            currentSection === section ||
            (section === "overview" && currentSection === "subscription-detail");

          return (
            <button
              key={section}
              type="button"
              onClick={() => onNavigate(section)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "border-r-4 border-orange-500 bg-orange-500/8 text-orange-400 translate-x-0.5"
                  : "border-r-4 border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-orange-500/15 text-orange-400"
                    : "bg-slate-800/60 text-slate-500 group-hover:text-slate-200"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="p-4 mt-auto">
        <button
          type="button"
          onClick={() => onNavigate("overview")}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[#ffb690] to-[#f97316] py-3 text-sm font-bold text-[#552100] shadow-lg shadow-orange-950/20 hover:opacity-90 transition-opacity"
        >
          <Wrench size={15} />
          Request Service
        </button>
      </div>
    </aside>
  );
}
