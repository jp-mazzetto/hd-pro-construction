import type { DashboardSection } from "./dashboard";

export type DashboardRouteParams = Record<string, string>;

export type NavigateToDashboard = (
  section?: DashboardSection,
  params?: DashboardRouteParams,
) => void;
