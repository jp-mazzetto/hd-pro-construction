import { CheckCircle } from "lucide-react";

import { TIER_LABELS } from "../../../consts/plans-promotion";
import type { SubscriptionPlanName, SubscriptionPlanOffer } from "../../../consts/site";

interface PlanCardProps {
  plan: SubscriptionPlanOffer;
  hasSubscription: boolean;
  isCurrentPlan: boolean;
  isFeatured: boolean;
  onPlanRequest: (plan: SubscriptionPlanName) => void;
}

interface PlanFeatureItemProps {
  value: string;
  isFeatured: boolean;
}

/**
 * Card individual de oferta de plano.
 * Encapsula estados visuais de plano atual, recomendado e CTA.
 */
export const PlanCard = ({
  plan,
  hasSubscription,
  isCurrentPlan,
  isFeatured,
  onPlanRequest,
}: PlanCardProps) => {
  const isStandard = plan.tier === "Standard Plan";
  const price = plan.priceLabel.replace("/month", "");

  return (
    <article
      className={`relative flex flex-col justify-between overflow-hidden p-10 transition-transform duration-300 ${
        isFeatured
          ? "z-10 bg-gray-800 shadow-2xl ring-1 ring-amber-400/20 md:scale-105"
          : "bg-gray-800/40 hover:bg-gray-800/70"
      }`}
    >
      {isCurrentPlan ? (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full bg-orange-500 px-5 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-widest text-white">
          Current Plan
        </div>
      ) : (
        isFeatured && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full bg-orange-500 px-5 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-widest text-gray-950">
            Recommended
          </div>
        )
      )}

      <div>
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
          {TIER_LABELS[plan.tier]}
        </span>

        <h3 className="mt-6 text-3xl font-bold text-white">{plan.tier}</h3>

        <div className="mb-10 mt-2 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-amber-400">{price}</span>
          <span className="text-sm font-medium uppercase text-gray-400">/month</span>
        </div>

        <ul className="mb-10 space-y-4">
          <PlanFeatureItem value={plan.maxSqFtLabel} isFeatured={isFeatured} />
          <PlanFeatureItem value={plan.visitsLabel} isFeatured={isFeatured} />
          {plan.features.map((feature) => (
            <PlanFeatureItem
              key={`${plan.tier}-${feature}`}
              value={feature}
              isFeatured={isFeatured}
            />
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => onPlanRequest(plan.tier)}
        disabled={isCurrentPlan}
        className={`w-full py-4 font-bold transition-all ${
          isCurrentPlan
            ? "cursor-not-allowed border border-white/15 bg-white/5 text-gray-400"
            : isFeatured
              ? "cursor-pointer bg-amber-400 text-gray-950 shadow-lg hover:opacity-90"
              : "cursor-pointer border border-gray-700 text-white hover:border-amber-400 hover:bg-amber-400 hover:text-gray-950"
        }`}
      >
        {getPlanCtaLabel({ planTier: plan.tier, hasSubscription, isStandard, isCurrentPlan })}
      </button>

      {hasSubscription && !isCurrentPlan && (
        <p className="mt-3 text-center text-xs text-gray-500">
          We will open a new checkout flow to confirm the plan change.
        </p>
      )}
    </article>
  );
};

/**
 * Item de lista para beneficios do plano.
 */
const PlanFeatureItem = ({ value, isFeatured }: PlanFeatureItemProps) => (
  <li className="flex items-center gap-3 text-gray-300">
    <CheckCircle
      size={18}
      className={isFeatured ? "text-orange-400" : "text-amber-400/70"}
      fill={isFeatured ? "currentColor" : "none"}
      strokeWidth={isFeatured ? 0 : 2}
    />
    {value}
  </li>
);

interface GetPlanCtaLabelInput {
  planTier: SubscriptionPlanName;
  hasSubscription: boolean;
  isStandard: boolean;
  isCurrentPlan: boolean;
}

const getPlanCtaLabel = ({
  planTier,
  hasSubscription,
  isStandard,
  isCurrentPlan,
}: GetPlanCtaLabelInput): string => {
  if (isCurrentPlan) {
    return "Current Plan";
  }

  if (hasSubscription) {
    return `Change to ${planTier.replace(" Plan", "")}`;
  }

  if (isStandard) {
    return `Get ${planTier}`;
  }

  return `Select ${planTier.replace(" Plan", "")}`;
};
