import { Outlet, useLocation } from "../router-adapter";

import useAuth from "../hooks/useAuth";
import useAppHandlers from "../hooks/useAppHandlers";
import useAuthUrlEffects from "../hooks/useAuthUrlEffects";
import AppSeo from "../components/AppSeo";
import AppAuthModal from "../components/app/AppAuthModal";
import { getSeoConfig } from "../consts/seo";

const RootContent = () => {
  const { pathname } = useLocation();
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

  const seoConfig = getSeoConfig(pathname);

  return (
    <>
      <AppSeo {...seoConfig} />
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
