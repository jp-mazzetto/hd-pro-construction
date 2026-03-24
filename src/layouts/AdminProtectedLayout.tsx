import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const AdminProtectedLayout = () => {
  const navigate = useNavigate();
  const { isAuthLoading, isAuthenticated, session, openAuthModal } = useAuth();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      openAuthModal();
      void navigate("/", { replace: true });
      return;
    }

    if (session?.actor.role !== "ADMIN") {
      void navigate("/dashboard", { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, session, openAuthModal, navigate]);

  if (isAuthLoading || !session || session.actor.role !== "ADMIN") {
    return null;
  }

  return <Outlet />;
};

export default AdminProtectedLayout;
