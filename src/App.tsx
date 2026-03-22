import { useCallback, useEffect, useState } from "react";

import {
  PHONE_NUMBER,
  type ServiceName,
  type SubscriptionPlanName,
} from "./consts/site";
import AppSeo from "./components/AppSeo";
import AuthModal from "./components/auth/AuthModal";
import CheckoutPage from "./components/CheckoutPage";
import CheckoutResult from "./components/CheckoutResult";
import MobileMenu from "./components/layout/MobileMenu";
import SiteFooter from "./components/layout/SiteFooter";
import SiteHeader from "./components/layout/SiteHeader";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import HeroSection from "./components/sections/HeroSection";
import PlansPromotionSection from "./components/sections/PlansPromotionSection";
import ServicesSection from "./components/sections/ServicesSection";
import useAuthSession from "./hooks/useAuthSession";
import useScrollThreshold from "./hooks/useScrollThreshold";
import useToggle from "./hooks/useToggle";
import {
  createSmsHref,
  createTelHref,
  getSmsMessage,
  navigateToHref,
} from "./utils/contact";

const PLAN_NAME_TO_TIER: Record<SubscriptionPlanName, string> = {
  "Basic Plan": "basic",
  "Standard Plan": "standard",
  "Premium Plan": "premium",
};

type CurrentPage =
  | { kind: "home" }
  | { kind: "checkout"; planTier: string }
  | { kind: "checkout-result"; status: "success" | "cancel" };

const resolveInitialPage = (): CurrentPage => {
  const path = window.location.pathname;
  if (path === "/success") return { kind: "checkout-result", status: "success" };
  if (path === "/cancel") return { kind: "checkout-result", status: "cancel" };
  if (path === "/checkout") {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan) return { kind: "checkout", planTier: plan };
  }
  return { kind: "home" };
};

/**
 * Componente raiz da aplicação, responsável por orquestrar layout, navegação
 * mobile e ações de contato (SMS/ligação).
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

  const [page, setPage] = useState<CurrentPage>(resolveInitialPage);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlanName | null>(null);

  const navigateToHome = useCallback(() => {
    setPage({ kind: "home" });
    window.history.replaceState({}, "", "/");
  }, []);

  const navigateToCheckout = useCallback((tier: string) => {
    setPage({ kind: "checkout", planTier: tier });
    window.history.replaceState({}, "", `/checkout?plan=${tier}`);
    window.scrollTo(0, 0);
  }, []);

  // Wrap login to redirect to checkout after successful auth
  const handleLogin = useCallback(
    async (input: Parameters<typeof login>[0]) => {
      const didLogin = await login(input);
      if (didLogin && pendingPlan) {
        const tier = PLAN_NAME_TO_TIER[pendingPlan];
        setPendingPlan(null);
        closeAuthModal();
        navigateToCheckout(tier);
      }
      return didLogin;
    },
    [login, pendingPlan, closeAuthModal, navigateToCheckout],
  );


  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const authStatus = currentUrl.searchParams.get("auth");
    const verifiedEmail = currentUrl.searchParams.get("email");

    if (!authStatus) {
      return;
    }

    if (authStatus === "verified") {
      setAuthNotice(
        verifiedEmail
          ? `Email confirmed for ${verifiedEmail}. You can sign in now.`
          : "Email confirmed. You can sign in now.",
      );
      openAuthModal();
    }

    if (authStatus === "verification-invalid") {
      setAuthNotice(
        "This verification link is invalid or has already expired. Request a new confirmation email.",
      );
      openAuthModal();
    }

    if (authStatus === "google-success") {
      setAuthNotice("Signed in with Google.");
      openAuthModal();
    }

    if (authStatus === "google-email-unverified") {
      setAuthNotice(
        "Your Google account email is not verified. Please use a verified Google account.",
      );
      openAuthModal();
    }

    if (authStatus === "google-account-inactive") {
      setAuthNotice("This account is inactive.");
      openAuthModal();
    }

    if (
      authStatus === "google-failed" ||
      authStatus === "google-invalid-state" ||
      authStatus === "google-token-exchange-failed" ||
      authStatus === "google-missing-email" ||
      authStatus === "google-unconfigured"
    ) {
      setAuthNotice(
        "Google sign-in could not be completed right now. Please try again.",
      );
      openAuthModal();
    }

    currentUrl.searchParams.delete("auth");
    currentUrl.searchParams.delete("email");
    window.history.replaceState({}, "", currentUrl.toString());
  }, [openAuthModal, setAuthNotice]);

  const handleSmsRequest = useCallback((service?: ServiceName) => {
    const message = getSmsMessage(service);
    navigateToHref(createSmsHref(PHONE_NUMBER, message));
  }, []);

  const handlePlanRequest = useCallback(
    (planName: SubscriptionPlanName) => {
      const tier = PLAN_NAME_TO_TIER[planName];

      if (session) {
        navigateToCheckout(tier);
        return;
      }

      setPendingPlan(planName);
      openAuthModal();
    },
    [session, navigateToCheckout, openAuthModal],
  );

  const handleCallRequest = useCallback(() => {
    navigateToHref(createTelHref(PHONE_NUMBER));
  }, []);

  // Checkout page (full-page, no header/footer from home)
  if (page.kind === "checkout") {
    return (
      <>
        <AppSeo />
        <div className="min-h-screen overflow-x-hidden font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
          <CheckoutPage planTier={page.planTier} onBack={navigateToHome} />

          <AuthModal
            isOpen={isAuthModalOpen}
            session={session}
            isLoading={isAuthLoading}
            isSubmitting={isAuthSubmitting}
            error={authError}
            notice={authNotice}
            onClose={closeAuthModal}
            onLogin={handleLogin}
            onRegister={register}
            onGoogleAuthStart={continueWithGoogle}
            onLogout={logout}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <AppSeo />

      <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
        <SiteHeader
          scrolled={scrolled}
          isMenuOpen={isMenuOpen}
          onMenuToggle={toggleMenu}
          onAuthClick={openAuthModal}
        />

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onAuthClick={openAuthModal}
        />

        <HeroSection onAuthClick={openAuthModal} />
        <ServicesSection onServiceRequest={handleSmsRequest} />
        {!isAuthLoading && (
          <PlansPromotionSection
            onPlanRequest={handlePlanRequest}
            isAuthenticated={Boolean(session)}
            showPlans={!session}
          />
        )}
        <AboutSection />
        <ContactSection
          onEstimateClick={handleSmsRequest}
          onCallClick={handleCallRequest}
        />
        <SiteFooter />

        <AuthModal
          isOpen={isAuthModalOpen}
          session={session}
          isLoading={isAuthLoading}
          isSubmitting={isAuthSubmitting}
          error={authError}
          notice={authNotice}
          onClose={closeAuthModal}
          onLogin={handleLogin}
          onRegister={register}
          onGoogleAuthStart={continueWithGoogle}
          onLogout={logout}
        />

        {page.kind === "checkout-result" && (
          <CheckoutResult
            status={page.status}
            onClose={navigateToHome}
          />
        )}
      </div>
    </>
  );
};

export default App;
