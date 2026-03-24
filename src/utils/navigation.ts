import type { SubscriptionPlanName } from "../consts/site";
import type { CurrentPage, DashboardRouteParams } from "../types/app";
import type { DashboardSection } from "../types/dashboard";

export const PLAN_NAME_TO_TIER: Record<SubscriptionPlanName, string> = {
  "Basic Plan": "basic",
  "Standard Plan": "standard",
  "Premium Plan": "premium",
};

const DASHBOARD_SECTION_MAP: Record<string, DashboardSection> = {
  subscriptions: "subscriptions",
  properties: "properties",
  billing: "billing",
  referrals: "referrals",
  schedule: "schedule",
  settings: "settings",
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

export const resolveInitialPage = (
  location: Pick<Location, "pathname" | "search"> = window.location,
): CurrentPage => {
  const { pathname, search } = location;

  if (pathname === "/success") {
    return { kind: "checkout-result", status: "success" };
  }

  if (pathname === "/cancel") {
    return { kind: "checkout-result", status: "cancel" };
  }

  if (pathname === "/checkout") {
    const params = new URLSearchParams(search);
    const plan = params.get("plan");

    if (plan) {
      return { kind: "checkout", planTier: plan };
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 1) {
      return { kind: "dashboard", section: "overview" };
    }

    if (segments[1] === "schedule" && segments[2] === "setup" && segments[3]) {
      return {
        kind: "dashboard",
        section: "schedule-setup",
        params: { id: segments[3] },
      };
    }

    if (segments[1] === "subscriptions" && segments[2]) {
      return {
        kind: "dashboard",
        section: "subscription-detail",
        params: { id: segments[2] },
      };
    }

    const section = DASHBOARD_SECTION_MAP[segments[1]];

    if (section) {
      return { kind: "dashboard", section };
    }

    return { kind: "dashboard", section: "overview" };
  }

  return { kind: "home" };
};
