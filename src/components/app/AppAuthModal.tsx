import AuthModal from "../auth/AuthModal";
import type { AuthSession, LoginInput, RegisterInput } from "../../types/auth";

interface AppAuthModalProps {
  isOpen: boolean;
  session: AuthSession | null;
  isAuthLoading: boolean;
  isAuthSubmitting: boolean;
  authError: string | null;
  authNotice: string | null;
  onClose: () => void;
  onLogin: (input: LoginInput) => Promise<boolean>;
  onRegister: (input: RegisterInput) => Promise<boolean>;
  onGoogleAuthStart: () => void;
  onLogout: () => Promise<void>;
}

const AppAuthModal = ({
  isOpen,
  session,
  isAuthLoading,
  isAuthSubmitting,
  authError,
  authNotice,
  onClose,
  onLogin,
  onRegister,
  onGoogleAuthStart,
  onLogout,
}: AppAuthModalProps) => (
  <AuthModal
    isOpen={isOpen}
    session={session}
    isLoading={isAuthLoading}
    isSubmitting={isAuthSubmitting}
    error={authError}
    notice={authNotice}
    onClose={onClose}
    onLogin={onLogin}
    onRegister={onRegister}
    onGoogleAuthStart={onGoogleAuthStart}
    onLogout={onLogout}
  />
);

export default AppAuthModal;
