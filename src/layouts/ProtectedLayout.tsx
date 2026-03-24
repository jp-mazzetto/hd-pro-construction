import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const { isAuthLoading, isAuthenticated, session, openAuthModal } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      openAuthModal();
      void navigate("/", { replace: true });
      return;
    }

    if (session?.actor.role === "ADMIN") {
      void navigate("/admin", { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, session, openAuthModal, navigate]);

  return <Outlet />;
};

export default ProtectedLayout;
