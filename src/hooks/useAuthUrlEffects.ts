import { useEffect, useRef } from "react";

import type { AuthSession } from "../types/auth";

const GOOGLE_FAILURE_STATUSES = new Set([
  "google-failed",
  "google-invalid-state",
  "google-token-exchange-failed",
  "google-missing-email",
  "google-unconfigured",
]);

interface UseAuthUrlEffectsOptions {
  session: AuthSession | null;
  isAuthLoading: boolean;
  openAuthModal: () => void;
  setAuthNotice: (notice: string | null) => void;
}

const useAuthUrlEffects = ({
  session,
  isAuthLoading,
  openAuthModal,
  setAuthNotice,
}: UseAuthUrlEffectsOptions) => {
  const pendingGoogleRedirect = useRef(false);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const authStatus = currentUrl.searchParams.get("auth");
    const verifiedEmail = currentUrl.searchParams.get("email");

    if (!authStatus) {
      return;
    }

    if (authStatus === "verified") {
      setAuthNotice(
        verifiedEmail
          ? `Email confirmed for ${verifiedEmail}. You can sign in now.`
          : "Email confirmed. You can sign in now.",
      );
      openAuthModal();
    } else if (authStatus === "verification-invalid") {
      setAuthNotice(
        "This verification link is invalid or has already expired. Request a new confirmation email.",
      );
      openAuthModal();
    } else if (authStatus === "google-email-unverified") {
      setAuthNotice(
        "Your Google account email is not verified. Please use a verified Google account.",
      );
      openAuthModal();
    } else if (authStatus === "google-account-inactive") {
      setAuthNotice("This account is inactive.");
      openAuthModal();
    } else if (authStatus === "google-success") {
      pendingGoogleRedirect.current = true;
    } else if (GOOGLE_FAILURE_STATUSES.has(authStatus)) {
      setAuthNotice(
        "Google sign-in could not be completed right now. Please try again.",
      );
      openAuthModal();
    }

    currentUrl.searchParams.delete("auth");
    currentUrl.searchParams.delete("email");
    window.history.replaceState({}, "", currentUrl.toString());
  }, [openAuthModal, setAuthNotice]);

  useEffect(() => {
    if (isAuthLoading || !session || !pendingGoogleRedirect.current) {
      return;
    }

    pendingGoogleRedirect.current = false;
    window.location.replace("/dashboard");
  }, [isAuthLoading, session]);
};

export default useAuthUrlEffects;
