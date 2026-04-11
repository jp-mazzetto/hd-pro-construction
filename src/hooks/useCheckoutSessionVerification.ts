import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchSubscription, verifyCheckoutSession } from "../lib/dashboard-client";
import { invalidateCheckoutQueries } from "../lib/query-invalidations";
import { queryKeys } from "../lib/query-keys";
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
  const queryClient = useQueryClient();
	const lastVerifiedSessionIdRef = useRef<string | null>(null);
	const onResolvedRef = useRef(onResolved);

	useEffect(() => {
		onResolvedRef.current = onResolved;
	}, [onResolved]);

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await verifyCheckoutSession(id);
      let hasLinkedProperty: boolean | null = null;

      try {
        const subscription = await queryClient.fetchQuery({
          queryKey: queryKeys.subscriptions.detail(result.subscriptionId),
          queryFn: () => fetchSubscription(result.subscriptionId),
          staleTime: 60 * 1000,
        });

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
      }

      await invalidateCheckoutQueries(queryClient);

      return {
        subscriptionId: result.subscriptionId,
        hasLinkedProperty,
      };
    },
    onSuccess: (result) => {
      if (result.subscriptionId) {
        onResolvedRef.current?.(result);
      }
    },
  });

  useEffect(() => {
    if (status !== "success" || !sessionId || !session) {
      return;
    }
    
		if (lastVerifiedSessionIdRef.current === sessionId) {
			return;
		}

		lastVerifiedSessionIdRef.current = sessionId;

    verifyMutation.mutate(sessionId);
  }, [session, sessionId, status, verifyMutation]);
};

export default useCheckoutSessionVerification;
