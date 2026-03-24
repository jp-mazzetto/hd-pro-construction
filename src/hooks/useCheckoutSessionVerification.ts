import { useEffect } from "react";

import { verifyCheckoutSession } from "../lib/dashboard-client";
import type { CurrentPage } from "../types/app";
import type { AuthSession } from "../types/auth";

interface UseCheckoutSessionVerificationOptions {
  page: CurrentPage;
  session: AuthSession | null;
}

const useCheckoutSessionVerification = ({
  page,
  session,
}: UseCheckoutSessionVerificationOptions) => {
  useEffect(() => {
    if (page.kind !== "checkout-result" || page.status !== "success") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId || !session) {
      return;
    }

    void verifyCheckoutSession(sessionId).catch(() => {
      // Non-critical: webhook may have already activated the subscription
    });
  }, [page, session]);
};

export default useCheckoutSessionVerification;
