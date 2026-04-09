import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthLoading, isAuthenticated, session, openAuthModal } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      openAuthModal();
      void navigate("/", { replace: true, state: { from: location.pathname } });
      return;
    }

    if (session?.actor.role === "ADMIN") {
      void navigate("/admin", { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, session, openAuthModal, navigate, location.pathname]);

  if (isAuthLoading || !isAuthenticated) return null;

  return <Outlet />;
};

export default ProtectedLayout;
