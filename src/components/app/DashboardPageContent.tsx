import BillingPage from "../dashboard/pages/BillingPage";
import OverviewPage from "../dashboard/pages/OverviewPage";
import PropertiesPage from "../dashboard/pages/PropertiesPage";
import SchedulePage from "../dashboard/pages/SchedulePage";
import ScheduleSetupPage from "../dashboard/pages/ScheduleSetupPage";
import SettingsPage from "../dashboard/pages/SettingsPage";
import SubscriptionDetailPage from "../dashboard/pages/SubscriptionDetailPage";
import type { DashboardRouteParams, NavigateToDashboard } from "../../types/app";
import type { AuthSession } from "../../types/auth";
import type { DashboardSection } from "../../types/dashboard";
import useAuth from "../../hooks/useAuth";

interface DashboardPageContentProps {
  session: AuthSession;
  section: DashboardSection;
  params?: DashboardRouteParams;
  onNavigate: NavigateToDashboard;
  onNavigateToPlans: () => void;
}

const DashboardPageContent = ({
  session,
  section,
  params,
  onNavigate,
  onNavigateToPlans,
}: DashboardPageContentProps) => {
  const { updateSessionActorName } = useAuth();

  switch (section) {
    case "overview":
      return <OverviewPage onNavigate={onNavigate} onNavigateToPlans={onNavigateToPlans} />;
    case "subscription-detail":
      return (
        <SubscriptionDetailPage
          subscriptionId={params?.id ?? ""}
          onNavigate={onNavigate}
        />
      );
    case "properties":
      return <PropertiesPage />;
    case "billing":
      return <BillingPage />;
    case "schedule":
      return <SchedulePage onNavigate={onNavigate} />;
    case "schedule-setup":
      return (
        <ScheduleSetupPage
          subscriptionId={params?.id ?? ""}
          onNavigate={onNavigate}
        />
      );
    case "settings":
      return <SettingsPage session={session} onSessionUpdate={updateSessionActorName} />;
    default:
      return <OverviewPage onNavigate={onNavigate} onNavigateToPlans={onNavigateToPlans} />;
  }
};

export default DashboardPageContent;
