import { useEffect } from "react";

import { PHONE_NUMBER } from "../consts/site";
import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import useContactActions from "../hooks/useContactActions";
import { useCurrentActiveSubscription } from "../hooks/useCurrentActiveSubscription";
import useScrollThreshold from "../hooks/useScrollThreshold";
import useToggle from "../hooks/useToggle";
import ServicesView from "../components/app/ServicesView";

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const scrolled = useScrollThreshold(50);
  const { value: isMenuOpen, toggle: toggleMenu, setFalse: closeMenu } = useToggle(false);
  const { isAuthenticated, openAuthModal } = useAuth();
  const { currentActiveSubscription } = useCurrentActiveSubscription(isAuthenticated);
  const { handleDashboardNavigation, handlePlanRequest } = useAppHandlers();
  const { requestSmsContact } = useContactActions(PHONE_NUMBER);

  return (
    <ServicesView
      scrolled={scrolled}
      isMenuOpen={isMenuOpen}
      isAuthenticated={isAuthenticated}
      currentSubscription={currentActiveSubscription}
      onMenuToggle={toggleMenu}
      onMenuClose={closeMenu}
      onAuthClick={openAuthModal}
      onDashboardClick={handleDashboardNavigation}
      onPlanRequest={handlePlanRequest}
      onServiceRequest={requestSmsContact}
      onQuestionRequest={() => requestSmsContact()}
    />
  );
};

export default ServicesPage;
