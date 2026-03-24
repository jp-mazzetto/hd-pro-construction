import type { DashboardSection } from "./dashboard";

export type DashboardRouteParams = Record<string, string>;

export type CurrentPage =
  | { kind: "home" }
  | { kind: "checkout"; planTier: string }
  | { kind: "checkout-result"; status: "success" | "cancel" }
  | { kind: "dashboard"; section: DashboardSection; params?: DashboardRouteParams };

export type NavigateToDashboard = (
  section?: DashboardSection,
  params?: DashboardRouteParams,
) => void;
