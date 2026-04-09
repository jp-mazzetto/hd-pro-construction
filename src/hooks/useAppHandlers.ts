import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { SubscriptionPlanName } from "../consts/site";
import type { LoginInput } from "../types/auth";
import type { DashboardSection } from "../types/dashboard";
import type { DashboardRouteParams } from "../types/app";
import useAuth from "./useAuth";
import { buildDashboardPath, getPlanTierByName } from "../utils/navigation";
import { fetchTermsStatus } from "../lib/auth-client";

const useAppHandlers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, openAuthModal, closeAuthModal, login, pendingPlan, setPendingPlan } =
    useAuth();

  const navigateToHome = useCallback(() => {
    void navigate("/");
  }, [navigate]);

  const navigateToPlans = useCallback(() => {
    void navigate("/plans");
  }, [navigate]);

  const navigateToServices = useCallback(() => {
    void navigate("/services");
  }, [navigate]);

  const navigateToCheckout = useCallback(
    (tier: string) => {
      void navigate(`/checkout?plan=${tier}`);
    },
    [navigate],
  );

  const navigateToContractOrCheckout = useCallback(
    async (tier: string) => {
      try {
        const { accepted } = await fetchTermsStatus();
        if (accepted) {
          void navigate(`/checkout?plan=${tier}`);
        } else {
          void navigate(`/contract?plan=${tier}`);
        }
      } catch {
        void navigate(`/contract?plan=${tier}`);
      }
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
        void navigateToContractOrCheckout(tier);
        return;
      }

      setPendingPlan(planName);
      openAuthModal();
    },
    [session, navigateToContractOrCheckout, openAuthModal, setPendingPlan],
  );

  const handleLogin = useCallback(
    async (input: LoginInput) => {
      const didLogin = await login(input);

      if (!didLogin) {
        return false;
      }

      closeAuthModal();

      if (pendingPlan) {
        await navigateToContractOrCheckout(getPlanTierByName(pendingPlan));
        setPendingPlan(null);
      } else {
        const from = (location.state as { from?: string } | null)?.from;
        if (from && from !== "/") {
          void navigate(from, { replace: true });
        } else {
          navigateToDashboard("overview");
        }
      }

      return true;
    },
    [login, closeAuthModal, pendingPlan, navigateToContractOrCheckout, navigateToDashboard, setPendingPlan, location.state, navigate],
  );

  return {
    navigateToHome,
    navigateToPlans,
    navigateToServices,
    navigateToCheckout,
    navigateToDashboard,
    handleDashboardNavigation,
    handlePlanRequest,
    handleLogin,
  };
};

export default useAppHandlers;
