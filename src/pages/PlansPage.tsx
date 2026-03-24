import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import useScrollThreshold from "../hooks/useScrollThreshold";
import useToggle from "../hooks/useToggle";
import PlansView from "../components/app/PlansView";

const PlansPage = () => {
  const scrolled = useScrollThreshold(50);
  const { value: isMenuOpen, toggle: toggleMenu, setFalse: closeMenu } = useToggle(false);
  const { isAuthenticated, openAuthModal } = useAuth();
  const { handleDashboardNavigation, handlePlanRequest } = useAppHandlers();

  return (
    <PlansView
      scrolled={scrolled}
      isMenuOpen={isMenuOpen}
      isAuthenticated={isAuthenticated}
      onMenuToggle={toggleMenu}
      onMenuClose={closeMenu}
      onAuthClick={openAuthModal}
      onDashboardClick={handleDashboardNavigation}
      onPlanRequest={handlePlanRequest}
    />
  );
};

export default PlansPage;
