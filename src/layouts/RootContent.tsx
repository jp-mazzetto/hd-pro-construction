import { Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import useAuthUrlEffects from "../hooks/useAuthUrlEffects";
import AppAuthModal from "../components/app/AppAuthModal";

const RootContent = () => {
  const {
    session,
    isAuthLoading,
    isAuthSubmitting,
    authError,
    authNotice,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    setAuthNotice,
    register,
    continueWithGoogle,
    logout,
  } = useAuth();

  const { handleLogin } = useAppHandlers();

  useAuthUrlEffects({
    session,
    isAuthLoading,
    openAuthModal,
    setAuthNotice,
  });

  return (
    <>
      <Outlet />
      <AppAuthModal
        isOpen={isAuthModalOpen}
        session={session}
        isAuthLoading={isAuthLoading}
        isAuthSubmitting={isAuthSubmitting}
        authError={authError}
        authNotice={authNotice}
        onClose={closeAuthModal}
        onLogin={handleLogin}
        onRegister={register}
        onGoogleAuthStart={continueWithGoogle}
        onLogout={logout}
      />
    </>
  );
};

export default RootContent;
