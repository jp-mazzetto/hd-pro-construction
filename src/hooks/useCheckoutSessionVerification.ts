import { useEffect } from "react";

import { verifyCheckoutSession } from "../lib/dashboard-client";
import type { AuthSession } from "../types/auth";

interface UseCheckoutSessionVerificationOptions {
  status: "success" | "cancel";
  session: AuthSession | null;
  sessionId: string | null;
}

const useCheckoutSessionVerification = ({
  status,
  session,
  sessionId,
}: UseCheckoutSessionVerificationOptions) => {
  useEffect(() => {
    if (status !== "success" || !sessionId || !session) {
      return;
    }

    void verifyCheckoutSession(sessionId).catch(() => {
      // Non-critical: webhook may have already activated the subscription
    });
  }, [status, session, sessionId]);
};

export default useCheckoutSessionVerification;
