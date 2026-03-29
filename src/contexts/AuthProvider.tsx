import { useState, type ReactNode } from "react";

import type { SubscriptionPlanName } from "../consts/site";
import useAuthSession from "../hooks/useAuthSession";
import useToggle from "../hooks/useToggle";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    session,
    isLoading: isAuthLoading,
    isSubmitting: isAuthSubmitting,
    error: authError,
    notice: authNotice,
    setNotice: setAuthNotice,
    login,
    register,
    continueWithGoogle,
    logout,
    updateSessionActorName,
  } = useAuthSession();

  const {
    value: isAuthModalOpen,
    setTrue: openAuthModal,
    setFalse: closeAuthModal,
  } = useToggle(false);

  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlanName | null>(null);

  const isAuthenticated = Boolean(session);

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthLoading,
        isAuthenticated,
        isAuthSubmitting,
        authError,
        authNotice,
        setAuthNotice,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        continueWithGoogle,
        logout,
        updateSessionActorName,
        pendingPlan,
        setPendingPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
