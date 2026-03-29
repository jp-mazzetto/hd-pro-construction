import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PHONE_NUMBER } from "../consts/site";
import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import useCheckoutSessionVerification from "../hooks/useCheckoutSessionVerification";
import useContactActions from "../hooks/useContactActions";
import useScrollThreshold from "../hooks/useScrollThreshold";
import useToggle from "../hooks/useToggle";
import HomeView from "../components/app/HomeView";

interface CheckoutResultPageProps {
  status: "success" | "cancel";
}

const CheckoutResultPage = ({ status }: CheckoutResultPageProps) => {
  const scrolled = useScrollThreshold(50);
  const { value: isMenuOpen, toggle: toggleMenu, setFalse: closeMenu } = useToggle(false);
  const { session, isAuthLoading, isAuthenticated, openAuthModal } = useAuth();
  const { handleDashboardNavigation, handlePlanRequest, navigateToHome, navigateToDashboard } =
    useAppHandlers();
  const { requestSmsContact, requestCallContact } = useContactActions(PHONE_NUMBER);
  const [searchParams] = useSearchParams();

  useCheckoutSessionVerification({
    status,
    session,
    sessionId: searchParams.get("session_id"),
  });

  const onScheduleSetup = useMemo(() => {
    if (status !== "success" || !session) {
      return undefined;
    }

    return () => {
      const subscriptionId = sessionStorage.getItem("latestCheckoutSubscriptionId");
      if (subscriptionId) {
        sessionStorage.removeItem("latestCheckoutSubscriptionId");
        navigateToDashboard("subscription-detail", { id: subscriptionId });
        return;
      }

      navigateToDashboard("overview");
    };
  }, [status, session, navigateToDashboard]);

  return (
    <HomeView
      scrolled={scrolled}
      isMenuOpen={isMenuOpen}
      isAuthLoading={isAuthLoading}
      isAuthenticated={isAuthenticated}
      checkoutResultStatus={status}
      onMenuToggle={toggleMenu}
      onMenuClose={closeMenu}
      onAuthClick={openAuthModal}
      onDashboardClick={handleDashboardNavigation}
      onServiceRequest={requestSmsContact}
      onPlanRequest={handlePlanRequest}
      onCallRequest={requestCallContact}
      onCheckoutResultClose={navigateToHome}
      onCheckoutResultScheduleSetup={onScheduleSetup}
    />
  );
};

export default CheckoutResultPage;
