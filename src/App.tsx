import { useCallback, useMemo, useState } from "react";

import { PHONE_NUMBER, type SubscriptionPlanName } from "./consts/site";
import AppAuthModal from "./components/app/AppAuthModal";
import CheckoutView from "./components/app/CheckoutView";
import DashboardView from "./components/app/DashboardView";
import HomeView from "./components/app/HomeView";
import useAppNavigation from "./hooks/useAppNavigation";
import useAuthSession from "./hooks/useAuthSession";
import useAuthUrlEffects from "./hooks/useAuthUrlEffects";
import useCheckoutSessionVerification from "./hooks/useCheckoutSessionVerification";
import useContactActions from "./hooks/useContactActions";
import useDashboardAuthGuard from "./hooks/useDashboardAuthGuard";
import useScrollThreshold from "./hooks/useScrollThreshold";
import useToggle from "./hooks/useToggle";
import { getPlanTierByName } from "./utils/navigation";

/**
 * Componente raiz da aplicação, responsável por orquestrar layout, navegação
 * e autenticação entre home, checkout e dashboard.
 */
const App = () => {
  const scrolled = useScrollThreshold(50);
  const { value: isMenuOpen, toggle: toggleMenu, setFalse: closeMenu } =
    useToggle(false);
  const {
    value: isAuthModalOpen,
    setTrue: openAuthModal,
    setFalse: closeAuthModal,
  } = useToggle(false);
  const {
    session,
    isLoading: isAuthLoading,
    isSubmitting: isAuthSubmitting,
    error: authError,
    notice: authNotice,
    setNotice: setAuthNotice,
    login,
    register,
    continueWithGoogle,
    logout,
  } = useAuthSession();

  const isAuthenticated = Boolean(session);
  const {
    page,
    currentPage,
    isDashboardBlockedByAuth,
    navigateToHome,
    navigateToCheckout,
    navigateToDashboard,
  } = useAppNavigation({
    isAuthLoading,
    isAuthenticated,
  });

  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlanName | null>(null);
  const { requestSmsContact, requestCallContact } = useContactActions(PHONE_NUMBER);

  useAuthUrlEffects({
    session,
    isAuthLoading,
    openAuthModal,
    setAuthNotice,
  });

  useCheckoutSessionVerification({
    page,
    session,
  });

  useDashboardAuthGuard({
    isDashboardBlockedByAuth,
    onBlockedByAuth: openAuthModal,
  });

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
    [session, navigateToCheckout, openAuthModal],
  );

  const handleLogin = useCallback(
    async (input: Parameters<typeof login>[0]) => {
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
    [login, closeAuthModal, pendingPlan, navigateToCheckout, navigateToDashboard],
  );

  const checkoutResultScheduleSetup = useMemo(() => {
    if (currentPage.kind !== "checkout-result") {
      return undefined;
    }

    if (currentPage.status !== "success") {
      return undefined;
    }

    if (!session) {
      return undefined;
    }

    return () => navigateToDashboard("overview");
  }, [currentPage, session, navigateToDashboard]);

  const authModal = (
    <AppAuthModal
      isOpen={isAuthModalOpen}
      session={session}
      isAuthLoading={isAuthLoading}
      isAuthSubmitting={isAuthSubmitting}
      authError={authError}
      authNotice={authNotice}
      onClose={closeAuthModal}
      onLogin={handleLogin}
      onRegister={register}
      onGoogleAuthStart={continueWithGoogle}
      onLogout={logout}
    />
  );

  if (currentPage.kind === "dashboard") {
    return (
      <>
        <DashboardView
          session={session}
          isAuthLoading={isAuthLoading}
          section={currentPage.section}
          params={currentPage.params}
          onNavigate={navigateToDashboard}
          onGoHome={navigateToHome}
          onLogout={logout}
        />
        {authModal}
      </>
    );
  }

  if (currentPage.kind === "checkout") {
    return (
      <>
        <CheckoutView planTier={currentPage.planTier} onBack={navigateToHome} />
        {authModal}
      </>
    );
  }

  return (
    <>
      <HomeView
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        isAuthLoading={isAuthLoading}
        isAuthenticated={isAuthenticated}
        checkoutResultStatus={
          currentPage.kind === "checkout-result" ? currentPage.status : undefined
        }
        onMenuToggle={toggleMenu}
        onMenuClose={closeMenu}
        onAuthClick={openAuthModal}
        onDashboardClick={handleDashboardNavigation}
        onServiceRequest={requestSmsContact}
        onPlanRequest={handlePlanRequest}
        onCallRequest={requestCallContact}
        onCheckoutResultClose={navigateToHome}
        onCheckoutResultScheduleSetup={checkoutResultScheduleSetup}
      />
      {authModal}
    </>
  );
};

export default App;
