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
    <section id="plans" className="relative bg-white py-24 md:py-28 lg:py-32">
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
                    ? "z-10 bg-gray-900 shadow-2xl ring-1 ring-orange-500/20 md:scale-105"
                    : "bg-gray-100 hover:bg-gray-200/80"
                }`}
              >
                {isStandard && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full bg-orange-500 px-5 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-widest text-white">
                    Recommended
                  </div>
                )}

                <div>
                  <span
                    className={`text-xs font-medium uppercase tracking-[0.15em] ${
                      isStandard ? "text-orange-400" : "text-gray-400"
                    }`}
                  >
                    {TIER_LABELS[plan.tier]}
                  </span>

                  <h3
                    className={`mt-6 text-3xl font-bold ${
                      isStandard ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.tier}
                  </h3>

                  <div className="mb-10 mt-2 flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold ${
                        isStandard ? "text-orange-400" : "text-orange-600"
                      }`}
                    >
                      {price}
                    </span>
                    <span
                      className={`text-sm font-medium uppercase ${
                        isStandard ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      /month
                    </span>
                  </div>

                  <ul className="mb-12 space-y-4">
                    <li
                      className={`flex items-center gap-3 ${
                        isStandard ? "text-gray-200" : "text-gray-600"
                      }`}
                    >
                      <CheckCircle
                        size={18}
                        className={isStandard ? "text-orange-400" : "text-orange-500/70"}
                        fill={isStandard ? "currentColor" : "none"}
                        strokeWidth={isStandard ? 0 : 2}
                      />
                      {plan.maxSqFtLabel}
                    </li>
                    <li
                      className={`flex items-center gap-3 ${
                        isStandard ? "text-gray-200" : "text-gray-600"
                      }`}
                    >
                      <CheckCircle
                        size={18}
                        className={isStandard ? "text-orange-400" : "text-orange-500/70"}
                        fill={isStandard ? "currentColor" : "none"}
                        strokeWidth={isStandard ? 0 : 2}
                      />
                      {plan.visitsLabel}
                    </li>
                    {plan.features.map((feature) => (
                      <li
                        key={`${plan.tier}-${feature}`}
                        className={`flex items-center gap-3 ${
                          isStandard ? "text-gray-200" : "text-gray-600"
                        }`}
                      >
                        <CheckCircle
                          size={18}
                          className={isStandard ? "text-orange-400" : "text-orange-500/70"}
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
                  className={`w-full py-4 font-bold transition-all ${
                    isStandard
                      ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600"
                      : "border border-gray-300 text-gray-900 hover:bg-orange-500 hover:text-white hover:border-orange-500"
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
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-2">
            <div className="flex flex-col items-center justify-between gap-8 rounded-xl border border-gray-200 bg-white px-8 py-10 md:flex-row md:px-12 md:py-12">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10">
                  <Tag size={30} className="text-orange-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {REFERRAL_PROMOTION.headline
                      .split("get 1 month of landscape free")
                      .map((part, i) =>
                        i === 0 ? (
                          <span key={i}>
                            {part.toUpperCase()}
                            <span className="text-orange-500">
                              GET 1 MONTH FREE.
                            </span>
                          </span>
                        ) : null,
                      )}
                  </h4>
                  <p className="mt-2 text-gray-500">
                    {REFERRAL_PROMOTION.helperText}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 whitespace-nowrap rounded-lg bg-orange-500 px-8 py-4 font-bold text-white shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
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
