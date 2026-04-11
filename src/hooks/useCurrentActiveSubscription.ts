import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchUserSubscriptions } from "../lib/auth-client";
import { queryKeys } from "../lib/query-keys";
import type { UserSubscription } from "../types/lib";

interface UseCurrentActiveSubscriptionReturn {
  currentActiveSubscription: UserSubscription | null;
  isLoadingSubscription: boolean;
}

const isCurrentlyActiveSubscription = (subscription: UserSubscription) =>
  subscription.status === "ACTIVE" && subscription.lifecycleState === "ACTIVE";

export const useCurrentActiveSubscription = (
  isAuthenticated: boolean,
): UseCurrentActiveSubscriptionReturn => {
  const subscriptionsQuery = useQuery({
    queryKey: queryKeys.subscriptions.all,
    queryFn: fetchUserSubscriptions,
    staleTime: 60 * 1000,
    enabled: isAuthenticated,
  });

  const currentActiveSubscription = useMemo(() => {
    if (!isAuthenticated || !subscriptionsQuery.data) {
      return null;
    }

    return (
      subscriptionsQuery.data.find(isCurrentlyActiveSubscription) ?? null
    );
  }, [isAuthenticated, subscriptionsQuery.data]);

  return {
    currentActiveSubscription,
    isLoadingSubscription: isAuthenticated && subscriptionsQuery.isPending,
  };
};
