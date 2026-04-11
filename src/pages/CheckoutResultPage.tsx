import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "../router-adapter";

import { PHONE_NUMBER } from "../consts/site";
import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import useCheckoutSessionVerification from "../hooks/useCheckoutSessionVerification";
import useContactActions from "../hooks/useContactActions";
import { useCurrentActiveSubscription } from "../hooks/useCurrentActiveSubscription";
import useScrollThreshold from "../hooks/useScrollThreshold";
import useToggle from "../hooks/useToggle";
import HomeView from "../components/app/HomeView";

interface CheckoutResultPageProps {
  status: "success" | "cancel";
}

type CheckoutSuccessContext = {
  subscriptionId: string;
  hasLinkedProperty: boolean | null;
};

const CheckoutResultPage = ({ status }: CheckoutResultPageProps) => {
  const scrolled = useScrollThreshold(50);
  const { value: isMenuOpen, toggle: toggleMenu, setFalse: closeMenu } = useToggle(false);
  const { session, isAuthLoading, isAuthenticated, openAuthModal } = useAuth();
  const { currentActiveSubscription, isLoadingSubscription } =
    useCurrentActiveSubscription(isAuthenticated);
  const {
    handleDashboardNavigation,
    handlePlanRequest,
    navigateToHome,
    navigateToDashboard,
    navigateToPlans,
    navigateToServices,
  } = useAppHandlers();
  const { requestSmsContact, requestCallContact } = useContactActions(PHONE_NUMBER);
  const [searchParams] = useSearchParams();
  const [checkoutContext, setCheckoutContext] = useState<CheckoutSuccessContext | null>(() => {
    const subscriptionId = sessionStorage.getItem("latestCheckoutSubscriptionId");
    if (!subscriptionId) return null;

    const storedHasLinkedProperty = sessionStorage.getItem(
      "latestCheckoutSubscriptionHasProperty",
    );

    return {
      subscriptionId,
      hasLinkedProperty:
        storedHasLinkedProperty === null ? null : storedHasLinkedProperty === "1",
    };
  });

  useCheckoutSessionVerification({
    status,
    session,
    sessionId: searchParams.get("session_id"),
    onResolved: (result) => setCheckoutContext(result),
  });

  const onScheduleSetup = useMemo(() => {
    if (status !== "success" || !session) {
      return undefined;
    }

    return () => {
      const subscriptionId =
        checkoutContext?.subscriptionId ??
        sessionStorage.getItem("latestCheckoutSubscriptionId");
      const storedHasLinkedProperty = sessionStorage.getItem(
        "latestCheckoutSubscriptionHasProperty",
      );
      const hasLinkedProperty =
        checkoutContext?.hasLinkedProperty ??
        (storedHasLinkedProperty === null ? null : storedHasLinkedProperty === "1");

      if (subscriptionId) {
        sessionStorage.removeItem("latestCheckoutSubscriptionId");
        sessionStorage.removeItem("latestCheckoutSubscriptionHasProperty");

        if (hasLinkedProperty === true) {
          navigateToDashboard("schedule-setup", { id: subscriptionId });
        } else {
          navigateToDashboard("subscription-detail", { id: subscriptionId });
        }
        return;
      }

      navigateToDashboard("overview");
    };
  }, [status, session, navigateToDashboard, checkoutContext]);

  const handleReferralPromotionClick = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    navigateToPlans();
  }, [isAuthenticated, openAuthModal, navigateToPlans]);

  return (
    <HomeView
      scrolled={scrolled}
      isMenuOpen={isMenuOpen}
      isAuthLoading={isAuthLoading}
      isAuthenticated={isAuthenticated}
      currentSubscription={currentActiveSubscription}
      isLoadingSubscription={isLoadingSubscription}
      checkoutResultStatus={status}
      onMenuToggle={toggleMenu}
      onMenuClose={closeMenu}
      onAuthClick={openAuthModal}
      onHeroPrimaryAction={navigateToServices}
      onDashboardClick={handleDashboardNavigation}
      onServiceRequest={requestSmsContact}
      onPlanRequest={handlePlanRequest}
      onReferralPromotionClick={handleReferralPromotionClick}
      onCallRequest={requestCallContact}
      onCheckoutResultClose={navigateToHome}
      checkoutResultHasLinkedProperty={checkoutContext?.hasLinkedProperty}
      onCheckoutResultScheduleSetup={onScheduleSetup}
    />
  );
};

export default CheckoutResultPage;
