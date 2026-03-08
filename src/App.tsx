import { useCallback } from "react";

import { PHONE_NUMBER, type ServiceName } from "./consts/site";
import AppSeo from "./components/AppSeo";
import MobileMenu from "./components/layout/MobileMenu";
import SiteFooter from "./components/layout/SiteFooter";
import SiteHeader from "./components/layout/SiteHeader";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import HeroSection from "./components/sections/HeroSection";
import ServicesSection from "./components/sections/ServicesSection";
import useScrollThreshold from "./hooks/useScrollThreshold";
import useToggle from "./hooks/useToggle";
import {
  createSmsHref,
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

  const handleSmsRequest = useCallback((service?: ServiceName) => {
    const message = getSmsMessage(service);
    navigateToHref(createSmsHref(PHONE_NUMBER, message));
  }, []);

  const handleCallRequest = useCallback(() => {
    navigateToHref(createTelHref(PHONE_NUMBER));
  }, []);

  return (
    <>
      <AppSeo />

      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
        <SiteHeader
          scrolled={scrolled}
          isMenuOpen={isMenuOpen}
          onMenuToggle={toggleMenu}
          onEstimateClick={handleSmsRequest}
        />

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onEstimateClick={handleSmsRequest}
        />

        <HeroSection onEstimateClick={handleSmsRequest} />
        <ServicesSection onServiceRequest={handleSmsRequest} />
        <AboutSection />
        <ContactSection
          onEstimateClick={handleSmsRequest}
          onCallClick={handleCallRequest}
        />
        <SiteFooter />
      </div>
    </>
  );
};

export default App;
