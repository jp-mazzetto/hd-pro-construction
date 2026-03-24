import type { SubscriptionPlanName } from "../consts/site";
import type { DashboardRouteParams } from "../types/app";
import type { DashboardSection } from "../types/dashboard";

export const PLAN_NAME_TO_TIER: Record<SubscriptionPlanName, string> = {
  "Basic Plan": "basic",
  "Standard Plan": "standard",
  "Premium Plan": "premium",
};

export const getPlanTierByName = (planName: SubscriptionPlanName): string =>
  PLAN_NAME_TO_TIER[planName];

export const buildDashboardPath = (
  section: DashboardSection,
  params?: DashboardRouteParams,
): string => {
  if (section === "schedule-setup" && params?.id) {
    return `/dashboard/schedule/setup/${params.id}`;
  }

  if (section === "subscription-detail" && params?.id) {
    return `/dashboard/subscriptions/${params.id}`;
  }

  if (section === "overview") {
    return "/dashboard";
  }

  return `/dashboard/${section}`;
};
