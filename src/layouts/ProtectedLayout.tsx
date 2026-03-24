import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const { isAuthLoading, isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    if (isAuthLoading || isAuthenticated) {
      return;
    }

    openAuthModal();
    void navigate("/", { replace: true });
  }, [isAuthLoading, isAuthenticated, openAuthModal, navigate]);

  return <Outlet />;
};

export default ProtectedLayout;
