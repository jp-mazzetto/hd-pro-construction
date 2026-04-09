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
import type { UserSubscription } from "../../types/lib";

interface HomeViewProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  currentSubscription?: UserSubscription | null;
  isLoadingSubscription?: boolean;
  checkoutResultStatus?: "success" | "cancel";
  checkoutResultHasLinkedProperty?: boolean | null;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onAuthClick: () => void;
  onHeroPrimaryAction: () => void;
  onDashboardClick: () => void;
  onServiceRequest: (service?: ServiceName) => void;
  onPlanRequest: (planName: SubscriptionPlanName) => void;
  onReferralPromotionClick: () => void;
  onCallRequest: () => void;
  onCheckoutResultClose: () => void;
  onCheckoutResultScheduleSetup?: () => void;
}

const HomeView = ({
  scrolled,
  isMenuOpen,
  isAuthLoading,
  isAuthenticated,
  currentSubscription,
  isLoadingSubscription = false,
  checkoutResultStatus,
  checkoutResultHasLinkedProperty,
  onMenuToggle,
  onMenuClose,
  onAuthClick,
  onHeroPrimaryAction,
  onDashboardClick,
  onServiceRequest,
  onPlanRequest,
  onReferralPromotionClick,
  onCallRequest,
  onCheckoutResultClose,
  onCheckoutResultScheduleSetup,
}: HomeViewProps) => (
  <>
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
      {!scrolled && (
        <div className="bg-orange-600 text-white text-center text-xs font-bold uppercase tracking-widest py-2 px-4">
          We currently serve lots located in Massachusetts only
        </div>
      )}
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

      <HeroSection onPrimaryAction={onHeroPrimaryAction} />
      <ServicesSection onServiceRequest={onServiceRequest} />
      {!isAuthLoading && (
        <PlansPromotionSection
          onPlanRequest={onPlanRequest}
          onReferralPromotionClick={onReferralPromotionClick}
          isAuthenticated={isAuthenticated}
          currentSubscription={currentSubscription}
          isLoadingSubscription={isLoadingSubscription}
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
