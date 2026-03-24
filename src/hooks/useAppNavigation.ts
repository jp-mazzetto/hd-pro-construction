import { useCallback, useMemo, useState } from "react";

import type { CurrentPage, DashboardRouteParams, NavigateToDashboard } from "../types/app";
import type { DashboardSection } from "../types/dashboard";
import { buildDashboardPath, resolveInitialPage } from "../utils/navigation";

const HOME_PAGE: CurrentPage = { kind: "home" };

interface UseAppNavigationOptions {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
}

interface UseAppNavigationReturn {
  page: CurrentPage;
  currentPage: CurrentPage;
  isDashboardBlockedByAuth: boolean;
  navigateToHome: () => void;
  navigateToCheckout: (tier: string) => void;
  navigateToDashboard: NavigateToDashboard;
}

const useAppNavigation = ({
  isAuthLoading,
  isAuthenticated,
}: UseAppNavigationOptions): UseAppNavigationReturn => {
  const [page, setPage] = useState<CurrentPage>(resolveInitialPage);

  const isDashboardBlockedByAuth =
    page.kind === "dashboard" && !isAuthLoading && !isAuthenticated;

  const currentPage = useMemo<CurrentPage>(
    () => (isDashboardBlockedByAuth ? HOME_PAGE : page),
    [isDashboardBlockedByAuth, page],
  );

  const navigateToHome = useCallback(() => {
    setPage(HOME_PAGE);
    window.history.replaceState({}, "", "/");
  }, []);

  const navigateToCheckout = useCallback((tier: string) => {
    setPage({ kind: "checkout", planTier: tier });
    window.history.replaceState({}, "", `/checkout?plan=${tier}`);
    window.scrollTo(0, 0);
  }, []);

  const navigateToDashboard = useCallback<
    (section?: DashboardSection, params?: DashboardRouteParams) => void
  >((section = "overview", params) => {
    setPage({ kind: "dashboard", section, params });
    window.history.replaceState({}, "", buildDashboardPath(section, params));
    window.scrollTo(0, 0);
  }, []);

  return {
    page,
    currentPage,
    isDashboardBlockedByAuth,
    navigateToHome,
    navigateToCheckout,
    navigateToDashboard,
  };
};

export default useAppNavigation;
