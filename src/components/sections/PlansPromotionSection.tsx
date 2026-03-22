import { CheckCircle, Tag } from "lucide-react";

import {
  LAWN_MAINTENANCE_PLANS,
  REFERRAL_PROMOTION,
  type SubscriptionPlanName,
} from "../../consts/site";

interface PlansPromotionSectionProps {
  onPlanRequest: (plan: SubscriptionPlanName) => void;
}

const TIER_LABELS: Record<SubscriptionPlanName, string> = {
  "Basic Plan": "Starter Tier",
  "Standard Plan": "Property Essential",
  "Premium Plan": "Estate Grade",
};

const PlansPromotionSection = ({ onPlanRequest }: PlansPromotionSectionProps) => {
  return (
    <section id="plans" className="relative bg-gray-900 py-24 text-white md:py-28 lg:py-32">
      <div className="container mx-auto px-6">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
          {LAWN_MAINTENANCE_PLANS.map((plan) => {
            const isStandard = plan.tier === "Standard Plan";
            const price = plan.priceLabel.replace("/month", "");

            return (
              <article
                key={plan.tier}
                className={`relative flex flex-col justify-between overflow-hidden p-10 transition-transform duration-300 ${
                  isStandard
                    ? "z-10 bg-gray-800 shadow-2xl ring-1 ring-amber-400/20 md:scale-105"
                    : "bg-gray-800/40 hover:bg-gray-800/70"
                }`}
              >
                {isStandard && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full bg-lime-500 px-5 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-widest text-gray-950">
                    Recommended
                  </div>
                )}

                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
                    {TIER_LABELS[plan.tier]}
                  </span>

                  <h3 className="mt-6 text-3xl font-bold text-white">
                    {plan.tier}
                  </h3>

                  <div className="mb-10 mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-amber-400">
                      {price}
                    </span>
                    <span className="text-sm font-medium uppercase text-gray-400">
                      /month
                    </span>
                  </div>

                  <ul className="mb-12 space-y-4">
                    <li className="flex items-center gap-3 text-gray-300">
                      <CheckCircle
                        size={18}
                        className={isStandard ? "text-lime-400" : "text-amber-400/70"}
                        fill={isStandard ? "currentColor" : "none"}
                        strokeWidth={isStandard ? 0 : 2}
                      />
                      {plan.maxSqFtLabel}
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <CheckCircle
                        size={18}
                        className={isStandard ? "text-lime-400" : "text-amber-400/70"}
                        fill={isStandard ? "currentColor" : "none"}
                        strokeWidth={isStandard ? 0 : 2}
                      />
                      {plan.visitsLabel}
                    </li>
                    {plan.features.map((feature) => (
                      <li
                        key={`${plan.tier}-${feature}`}
                        className="flex items-center gap-3 text-gray-300"
                      >
                        <CheckCircle
                          size={18}
                          className={isStandard ? "text-lime-400" : "text-amber-400/70"}
                          fill={isStandard ? "currentColor" : "none"}
                          strokeWidth={isStandard ? 0 : 2}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onPlanRequest(plan.tier)}
                  className={`w-full cursor-pointer py-4 font-bold transition-all ${
                    isStandard
                      ? "bg-amber-400 text-gray-950 shadow-lg hover:opacity-90"
                      : "border border-gray-700 text-white hover:bg-amber-400 hover:text-gray-950 hover:border-amber-400"
                  }`}
                >
                  {isStandard ? `Get ${plan.tier}` : `Select ${plan.tier.replace(" Plan", "")}`}
                </button>
              </article>
            );
          })}
        </div>

        {/* Referral Banner */}
        <div className="mt-16 md:mt-20">
          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-2">
            <div className="flex flex-col items-center justify-between gap-8 rounded-xl border border-gray-700/30 bg-gray-800/40 px-8 py-10 md:flex-row md:px-12 md:py-12">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-lime-500/30 bg-lime-500/10">
                  <Tag size={30} className="text-lime-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white md:text-3xl">
                    {REFERRAL_PROMOTION.headline
                      .split("get 1 month of landscape free")
                      .map((part, i) =>
                        i === 0 ? (
                          <span key={i}>
                            {part.toUpperCase()}
                            <span className="text-lime-400">
                              GET 1 MONTH FREE.
                            </span>
                          </span>
                        ) : null,
                      )}
                  </h4>
                  <p className="mt-2 text-gray-400">
                    {REFERRAL_PROMOTION.helperText}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 cursor-pointer whitespace-nowrap rounded-lg bg-lime-500 px-8 py-4 font-bold text-gray-950 shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                Invite Your Neighbors
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansPromotionSection;
