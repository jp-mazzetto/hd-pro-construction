import { type ReactNode } from "react";

import type { AuthSession } from "../../types/auth";
import AdminTopBar from "./AdminTopBar";
import "../dashboard/dashboard-theme.css";

interface AdminLayoutProps {
  session: AuthSession;
  onLogout: () => void;
  children: ReactNode;
}

export default function AdminLayout({
  session,
  onLogout,
  children,
}: AdminLayoutProps) {
  return (
    <div className="dashboard-shell flex h-screen flex-col overflow-hidden text-white">
      <div className="dashboard-atmosphere" aria-hidden />

      <AdminTopBar session={session} onLogout={onLogout} />

      <main className="dashboard-main-scroll flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <div className="dashboard-enter mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
