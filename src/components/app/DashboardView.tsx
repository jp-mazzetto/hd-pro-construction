import AppSeo from "../AppSeo";
import DashboardLayout from "../dashboard/DashboardLayout";
import type { DashboardRouteParams, NavigateToDashboard } from "../../types/app";
import type { AuthSession } from "../../types/auth";
import type { DashboardSection } from "../../types/dashboard";
import DashboardPageContent from "./DashboardPageContent";

interface DashboardViewProps {
  session: AuthSession | null;
  isAuthLoading: boolean;
  section: DashboardSection;
  params?: DashboardRouteParams;
  onNavigate: NavigateToDashboard;
  onGoHome: () => void;
  onLogout: () => Promise<void>;
}

const DashboardView = ({
  session,
  isAuthLoading,
  section,
  params,
  onNavigate,
  onGoHome,
  onLogout,
}: DashboardViewProps) => {
  if (isAuthLoading) {
    return (
      <>
        <AppSeo />
        <div className="min-h-screen bg-slate-950" />
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <AppSeo />
      <DashboardLayout
        session={session}
        currentSection={section}
        onNavigate={onNavigate}
        onGoHome={onGoHome}
        onLogout={onLogout}
      >
        <DashboardPageContent
          session={session}
          section={section}
          params={params}
          onNavigate={onNavigate}
        />
      </DashboardLayout>
    </>
  );
};

export default DashboardView;
