import { useMemo } from "react";

import type { SubscriptionPlanName } from "../consts/site";
import { API_TIER_TO_SITE_TIER } from "../consts/plans-promotion";
import type { UserSubscription } from "../types/lib";

interface UsePlansPromotionSectionReturn {
  hasSubscription: boolean;
  currentPlanTier: SubscriptionPlanName | null;
}

export const usePlansPromotionSection = (
  currentSubscription?: UserSubscription | null,
): UsePlansPromotionSectionReturn => {
  const hasSubscription = Boolean(currentSubscription);

  const currentPlanTier = useMemo(
    () =>
      currentSubscription
        ? API_TIER_TO_SITE_TIER[currentSubscription.plan.tier]
        : null,
    [currentSubscription],
  );

  return {
    hasSubscription,
    currentPlanTier,
  };
};
