import BillingPage from "../dashboard/pages/BillingPage";
import OverviewPage from "../dashboard/pages/OverviewPage";
import PropertiesPage from "../dashboard/pages/PropertiesPage";
import ReferralsPage from "../dashboard/pages/ReferralsPage";
import SchedulePage from "../dashboard/pages/SchedulePage";
import ScheduleSetupPage from "../dashboard/pages/ScheduleSetupPage";
import SettingsPage from "../dashboard/pages/SettingsPage";
import SubscriptionDetailPage from "../dashboard/pages/SubscriptionDetailPage";
import SubscriptionsPage from "../dashboard/pages/SubscriptionsPage";
import type { DashboardRouteParams, NavigateToDashboard } from "../../types/app";
import type { AuthSession } from "../../types/auth";
import type { DashboardSection } from "../../types/dashboard";

interface DashboardPageContentProps {
  session: AuthSession;
  section: DashboardSection;
  params?: DashboardRouteParams;
  onNavigate: NavigateToDashboard;
}

const DashboardPageContent = ({
  session,
  section,
  params,
  onNavigate,
}: DashboardPageContentProps) => {
  switch (section) {
    case "overview":
      return <OverviewPage onNavigate={onNavigate} />;
    case "subscriptions":
      return <SubscriptionsPage onNavigate={onNavigate} />;
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
    case "referrals":
      return <ReferralsPage />;
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
      return <SettingsPage session={session} onSessionUpdate={() => {}} />;
    default:
      return <OverviewPage onNavigate={onNavigate} />;
  }
};

export default DashboardPageContent;
