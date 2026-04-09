import { LAWN_MAINTENANCE_PLANS, type SubscriptionPlanName } from "../../consts/site";
import { usePlansPromotionSection } from "../../hooks/usePlansPromotionSection";
import type { UserSubscription } from "../../types/lib";
import {
  CurrentSubscriptionCard,
  PlanCard,
  PlansPromotionHeader,
  ReferralPromotionCard,
  SubscriptionLoadingNotice,
} from "./plans-promotion";

interface PlansPromotionSectionProps {
  onPlanRequest: (plan: SubscriptionPlanName) => void;
  onReferralPromotionClick: () => void;
  isAuthenticated?: boolean;
  currentSubscription?: UserSubscription | null;
  isLoadingSubscription?: boolean;
  showPlans?: boolean;
}

/**
 * Secao de promocao e gerenciamento de planos de manutencao.
 * Compoe subcomponentes de UI para manter o fluxo mais legivel.
 */
const PlansPromotionSection = ({
  onPlanRequest,
  onReferralPromotionClick,
  isAuthenticated,
  currentSubscription,
  isLoadingSubscription = false,
  showPlans = true,
}: PlansPromotionSectionProps) => {
  const { hasSubscription, currentPlanTier } =
    usePlansPromotionSection(currentSubscription);

  return (
    <section id="plans" className="relative bg-gray-900 py-24 text-white md:py-28 lg:py-32">
      <div className="container mx-auto px-6">
        {showPlans && (
          <>
            <PlansPromotionHeader hasSubscription={hasSubscription} />

            {isAuthenticated && isLoadingSubscription && <SubscriptionLoadingNotice />}

            {hasSubscription && currentSubscription && (
              <CurrentSubscriptionCard subscription={currentSubscription} />
            )}

            <div
              id="plan-options"
              className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center"
            >
              {LAWN_MAINTENANCE_PLANS.map((plan) => {
                const isStandard = plan.tier === "Standard Plan";
                const isCurrentPlan = currentPlanTier === plan.tier;
                const isFeatured = isCurrentPlan || (!hasSubscription && isStandard);

                return (
                  <PlanCard
                    key={plan.tier}
                    plan={plan}
                    hasSubscription={hasSubscription}
                    isCurrentPlan={isCurrentPlan}
                    isFeatured={isFeatured}
                    onPlanRequest={onPlanRequest}
                  />
                );
              })}
            </div>
          </>
        )}

        <div className={showPlans ? "mt-16 md:mt-20" : ""}>
          <ReferralPromotionCard
            hasSubscription={hasSubscription}
            onActionClick={onReferralPromotionClick}
          />
        </div>
      </div>
    </section>
  );
};

export default PlansPromotionSection;
