import { useEffect } from "react";

import { fetchSubscription, verifyCheckoutSession } from "../lib/dashboard-client";
import type { AuthSession } from "../types/auth";

interface UseCheckoutSessionVerificationOptions {
  status: "success" | "cancel";
  session: AuthSession | null;
  sessionId: string | null;
  onResolved?: (result: {
    subscriptionId: string;
    hasLinkedProperty: boolean | null;
  }) => void;
}

const useCheckoutSessionVerification = ({
  status,
  session,
  sessionId,
  onResolved,
}: UseCheckoutSessionVerificationOptions) => {
  useEffect(() => {
    if (status !== "success" || !sessionId || !session) {
      return;
    }

    void verifyCheckoutSession(sessionId)
      .then(async (result) => {
        let hasLinkedProperty: boolean | null = null;

        try {
          const subscription = await fetchSubscription(result.subscriptionId);
          hasLinkedProperty = Boolean(subscription.property);
          sessionStorage.setItem(
            "latestCheckoutSubscriptionHasProperty",
            hasLinkedProperty ? "1" : "0",
          );
        } catch {
          // Non-critical: fallback flow handles unknown property state.
        }

        if (result.subscriptionId) {
          sessionStorage.setItem(
            "latestCheckoutSubscriptionId",
            result.subscriptionId,
          );

          onResolved?.({
            subscriptionId: result.subscriptionId,
            hasLinkedProperty,
          });
        }
      })
      .catch(() => {
        // Non-critical: webhook may have already activated the subscription
      });
  }, [status, session, sessionId, onResolved]);
};

export default useCheckoutSessionVerification;
