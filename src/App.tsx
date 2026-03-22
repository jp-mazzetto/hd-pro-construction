import { useCallback, useEffect } from "react";

import {
  PHONE_NUMBER,
  type ServiceName,
  type SubscriptionPlanName,
} from "./consts/site";
import AppSeo from "./components/AppSeo";
import AuthModal from "./components/auth/AuthModal";
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
  getPlanSmsMessage,
  createTelHref,
  getSmsMessage,
  navigateToHref,
} from "./utils/contact";

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

  const handlePlanRequest = useCallback((planName: SubscriptionPlanName) => {
    const message = getPlanSmsMessage(planName);
    navigateToHref(createSmsHref(PHONE_NUMBER, message));
  }, []);

  const handleCallRequest = useCallback(() => {
    navigateToHref(createTelHref(PHONE_NUMBER));
  }, []);

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
        <PlansPromotionSection onPlanRequest={handlePlanRequest} />
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
          onLogin={login}
          onRegister={register}
          onGoogleAuthStart={continueWithGoogle}
          onLogout={logout}
        />
      </div>
    </>
  );
};

export default App;
