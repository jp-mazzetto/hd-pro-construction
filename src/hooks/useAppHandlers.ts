import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import type { SubscriptionPlanName } from "../consts/site";
import type { LoginInput } from "../types/auth";
import type { DashboardSection } from "../types/dashboard";
import type { DashboardRouteParams } from "../types/app";
import useAuth from "./useAuth";
import { buildDashboardPath, getPlanTierByName } from "../utils/navigation";

const useAppHandlers = () => {
  const navigate = useNavigate();
  const { session, openAuthModal, closeAuthModal, login, pendingPlan, setPendingPlan } =
    useAuth();

  const navigateToHome = useCallback(() => {
    void navigate("/");
  }, [navigate]);

  const navigateToPlans = useCallback(() => {
    void navigate("/plans");
  }, [navigate]);

  const navigateToCheckout = useCallback(
    (tier: string) => {
      void navigate(`/checkout?plan=${tier}`);
    },
    [navigate],
  );

  const navigateToDashboard = useCallback(
    (section: DashboardSection = "overview", params?: DashboardRouteParams) => {
      void navigate(buildDashboardPath(section, params));
    },
    [navigate],
  );

  const handleDashboardNavigation = useCallback(() => {
    navigateToDashboard("overview");
  }, [navigateToDashboard]);

  const handlePlanRequest = useCallback(
    (planName: SubscriptionPlanName) => {
      const tier = getPlanTierByName(planName);

      if (session) {
        navigateToCheckout(tier);
        return;
      }

      setPendingPlan(planName);
      openAuthModal();
    },
    [session, navigateToCheckout, openAuthModal, setPendingPlan],
  );

  const handleLogin = useCallback(
    async (input: LoginInput) => {
      const didLogin = await login(input);

      if (!didLogin) {
        return false;
      }

      closeAuthModal();

      if (pendingPlan) {
        navigateToCheckout(getPlanTierByName(pendingPlan));
        setPendingPlan(null);
      } else {
        navigateToDashboard("overview");
      }

      return true;
    },
    [login, closeAuthModal, pendingPlan, navigateToCheckout, navigateToDashboard, setPendingPlan],
  );

  return {
    navigateToHome,
    navigateToPlans,
    navigateToCheckout,
    navigateToDashboard,
    handleDashboardNavigation,
    handlePlanRequest,
    handleLogin,
  };
};

export default useAppHandlers;
