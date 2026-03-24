import { PHONE_NUMBER } from "../consts/site";
import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import useContactActions from "../hooks/useContactActions";
import useScrollThreshold from "../hooks/useScrollThreshold";
import useToggle from "../hooks/useToggle";
import HomeView from "../components/app/HomeView";

const HomePage = () => {
  const scrolled = useScrollThreshold(50);
  const { value: isMenuOpen, toggle: toggleMenu, setFalse: closeMenu } = useToggle(false);
  const { isAuthLoading, isAuthenticated, openAuthModal } = useAuth();
  const { handleDashboardNavigation, handlePlanRequest, navigateToHome } = useAppHandlers();
  const { requestSmsContact, requestCallContact } = useContactActions(PHONE_NUMBER);

  return (
    <HomeView
      scrolled={scrolled}
      isMenuOpen={isMenuOpen}
      isAuthLoading={isAuthLoading}
      isAuthenticated={isAuthenticated}
      onMenuToggle={toggleMenu}
      onMenuClose={closeMenu}
      onAuthClick={openAuthModal}
      onDashboardClick={handleDashboardNavigation}
      onServiceRequest={requestSmsContact}
      onPlanRequest={handlePlanRequest}
      onCallRequest={requestCallContact}
      onCheckoutResultClose={navigateToHome}
    />
  );
};

export default HomePage;
