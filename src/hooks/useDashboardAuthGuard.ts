import { useEffect } from "react";

interface UseDashboardAuthGuardOptions {
  isDashboardBlockedByAuth: boolean;
  onBlockedByAuth: () => void;
}

const useDashboardAuthGuard = ({
  isDashboardBlockedByAuth,
  onBlockedByAuth,
}: UseDashboardAuthGuardOptions) => {
  useEffect(() => {
    if (!isDashboardBlockedByAuth) {
      return;
    }

    onBlockedByAuth();
    window.history.replaceState({}, "", "/");
  }, [isDashboardBlockedByAuth, onBlockedByAuth]);
};

export default useDashboardAuthGuard;
