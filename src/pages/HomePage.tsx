import { PHONE_NUMBER } from "../consts/site";
import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import useContactActions from "../hooks/useContactActions";
import { useCurrentActiveSubscription } from "../hooks/useCurrentActiveSubscription";
import useScrollThreshold from "../hooks/useScrollThreshold";
import useToggle from "../hooks/useToggle";
import HomeView from "../components/app/HomeView";

const HomePage = () => {
  const scrolled = useScrollThreshold(50);
  const { value: isMenuOpen, toggle: toggleMenu, setFalse: closeMenu } = useToggle(false);
  const { isAuthLoading, isAuthenticated, openAuthModal } = useAuth();
  const { currentActiveSubscription, isLoadingSubscription } =
    useCurrentActiveSubscription(isAuthenticated);
  const {
    handleDashboardNavigation,
    handlePlanRequest,
    navigateToHome,
    navigateToPlans,
    navigateToServices,
  } = useAppHandlers();
  const { requestSmsContact, requestCallContact } = useContactActions(PHONE_NUMBER);

  const handleReferralPromotionClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    navigateToPlans();
  };

  return (
    <HomeView
      scrolled={scrolled}
      isMenuOpen={isMenuOpen}
      isAuthLoading={isAuthLoading}
      isAuthenticated={isAuthenticated}
      currentSubscription={currentActiveSubscription}
      isLoadingSubscription={isLoadingSubscription}
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
    />
  );
};

export default HomePage;
