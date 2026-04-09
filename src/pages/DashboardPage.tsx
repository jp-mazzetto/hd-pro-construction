import { useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import DashboardView from "../components/app/DashboardView";
import type { DashboardSection } from "../types/dashboard";

interface DashboardPageProps {
  section: DashboardSection;
}

const DashboardPage = ({ section: sectionOverride }: DashboardPageProps) => {
  const params = useParams();
  const { session, isAuthLoading, logout } = useAuth();
  const { navigateToDashboard, navigateToPlans, navigateToHome } = useAppHandlers();

  const section = sectionOverride;

  const routeParams = params.id ? { id: params.id } : undefined;

  if (isAuthLoading) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardView
      session={session}
      isAuthLoading={isAuthLoading}
      section={section}
      params={routeParams}
      onNavigate={navigateToDashboard}
      onNavigateToPlans={navigateToPlans}
      onGoHome={navigateToHome}
      onLogout={logout}
    />
  );
};

export default DashboardPage;
