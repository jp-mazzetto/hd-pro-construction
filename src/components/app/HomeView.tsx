import AppSeo from "../AppSeo";
import CheckoutResult from "../CheckoutResult";
import MobileMenu from "../layout/MobileMenu";
import SiteFooter from "../layout/SiteFooter";
import SiteHeader from "../layout/SiteHeader";
import AboutSection from "../sections/AboutSection";
import ContactSection from "../sections/ContactSection";
import HeroSection from "../sections/HeroSection";
import PlansPromotionSection from "../sections/PlansPromotionSection";
import ServicesSection from "../sections/ServicesSection";
import type { ServiceName, SubscriptionPlanName } from "../../consts/site";

interface HomeViewProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  checkoutResultStatus?: "success" | "cancel";
  checkoutResultHasLinkedProperty?: boolean | null;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
  onServiceRequest: (service?: ServiceName) => void;
  onPlanRequest: (planName: SubscriptionPlanName) => void;
  onCallRequest: () => void;
  onCheckoutResultClose: () => void;
  onCheckoutResultScheduleSetup?: () => void;
}

const HomeView = ({
  scrolled,
  isMenuOpen,
  isAuthLoading,
  isAuthenticated,
  checkoutResultStatus,
  checkoutResultHasLinkedProperty,
  onMenuToggle,
  onMenuClose,
  onAuthClick,
  onDashboardClick,
  onServiceRequest,
  onPlanRequest,
  onCallRequest,
  onCheckoutResultClose,
  onCheckoutResultScheduleSetup,
}: HomeViewProps) => (
  <>
    <AppSeo />
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
      <SiteHeader
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        onMenuToggle={onMenuToggle}
        onAuthClick={onAuthClick}
        onDashboardClick={onDashboardClick}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        onClose={onMenuClose}
        onAuthClick={onAuthClick}
        onDashboardClick={() => {
          onMenuClose();
          onDashboardClick();
        }}
      />

      <HeroSection onAuthClick={onAuthClick} />
      <ServicesSection onServiceRequest={onServiceRequest} />
      {!isAuthLoading && (
        <PlansPromotionSection
          onPlanRequest={onPlanRequest}
          isAuthenticated={isAuthenticated}
          showPlans
        />
      )}
      <AboutSection />
      <ContactSection onEstimateClick={onServiceRequest} onCallClick={onCallRequest} />
      <SiteFooter />

      {checkoutResultStatus && (
        <CheckoutResult
          status={checkoutResultStatus}
          hasLinkedProperty={checkoutResultHasLinkedProperty}
          onClose={onCheckoutResultClose}
          onScheduleSetup={onCheckoutResultScheduleSetup}
        />
      )}
    </div>
  </>
);

export default HomeView;
