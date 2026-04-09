import { useEffect, useState } from "react";

import { fetchUserSubscriptions } from "../lib/auth-client";
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
  const [currentActiveSubscription, setCurrentActiveSubscription] =
    useState<UserSubscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated) {
      setCurrentActiveSubscription(null);
      setIsLoadingSubscription(false);
      return () => {
        cancelled = true;
      };
    }

    const loadCurrentSubscription = async () => {
      setIsLoadingSubscription(true);

      try {
        const subscriptions = await fetchUserSubscriptions();
        if (cancelled) return;

        const activeSubscription =
          subscriptions.find(isCurrentlyActiveSubscription) ?? null;

        setCurrentActiveSubscription(activeSubscription);
      } catch {
        if (!cancelled) {
          setCurrentActiveSubscription(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSubscription(false);
        }
      }
    };

    void loadCurrentSubscription();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return {
    currentActiveSubscription,
    isLoadingSubscription,
  };
};
