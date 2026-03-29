import { type ReactNode, useCallback, useState } from "react";

import type { AuthSession } from "../../types/auth";
import type { DashboardSection } from "../../types/dashboard";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopBar from "./DashboardTopBar";
import "./dashboard-theme.css";

const SECTION_TITLES: Record<DashboardSection, string> = {
  overview: "Dashboard",
  "subscription-detail": "Plan Details",
  properties: "Properties",
  billing: "Billing History",
  schedule: "Schedule",
  "schedule-setup": "Set Up Schedule",
  settings: "Settings",
};

interface DashboardLayoutProps {
  session: AuthSession;
  currentSection: DashboardSection;
  onNavigate: (section: DashboardSection, params?: Record<string, string>) => void;
  onGoHome: () => void;
  onLogout: () => void;
  children: ReactNode;
}

export default function DashboardLayout({
  session,
  currentSection,
  onNavigate,
  onGoHome,
  onLogout,
  children,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = useCallback(
    (section: DashboardSection) => {
      onNavigate(section);
      setIsMobileMenuOpen(false);
    },
    [onNavigate],
  );

  return (
    <div className="dashboard-shell flex h-screen overflow-hidden text-white">
      <div className="dashboard-atmosphere" aria-hidden />

      {/* Desktop sidebar */}
      <DashboardSidebar
        session={session}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onGoHome={onGoHome}
        className="hidden lg:flex w-64 shrink-0"
      />

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            onKeyDown={() => {}}
            role="presentation"
          />
          <DashboardSidebar
            session={session}
            currentSection={currentSection}
            onNavigate={handleNavigate}
            onGoHome={onGoHome}
            className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
          />
        </>
      )}

      {/* Main content */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <DashboardTopBar
          session={session}
          title={SECTION_TITLES[currentSection]}
          onLogout={onLogout}
          onMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
          onNavigate={handleNavigate}
        />

        <main className="dashboard-main-scroll flex-1 overflow-y-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="dashboard-enter mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
