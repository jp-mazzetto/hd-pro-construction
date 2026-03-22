import {
  ArrowRightLeft,
  CheckCircle,
  Clock3,
  Home,
  Loader2,
  ShieldCheck,
  Tag,
} from "lucide-react";

import {
  LAWN_MAINTENANCE_PLANS,
  REFERRAL_PROMOTION,
  type SubscriptionPlanName,
} from "../../consts/site";
import type { SubscriptionStatus, UserSubscription } from "../../types/lib";

interface PlansPromotionSectionProps {
  onPlanRequest: (plan: SubscriptionPlanName) => void;
  isAuthenticated?: boolean;
  currentSubscription?: UserSubscription | null;
  isLoadingSubscription?: boolean;
  showPlans?: boolean;
}

const TIER_LABELS: Record<SubscriptionPlanName, string> = {
  "Basic Plan": "Starter Tier",
  "Standard Plan": "Property Essential",
  "Premium Plan": "Estate Grade",
};

const API_TIER_TO_SITE_TIER: Record<
  UserSubscription["plan"]["tier"],
  SubscriptionPlanName
> = {
  BASIC: "Basic Plan",
  STANDARD: "Standard Plan",
  PREMIUM: "Premium Plan",
};

const STATUS_META: Record<
  SubscriptionStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "border-lime-400/40 bg-lime-500/15 text-lime-300",
  },
  PENDING: {
    label: "Pending Payment",
    className: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-red-400/40 bg-red-500/15 text-red-300",
  },
  EXPIRED: {
    label: "Expired",
    className: "border-gray-500/40 bg-gray-500/15 text-gray-300",
  },
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const formatMoney = (valueInCents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(valueInCents / 100);

const PlansPromotionSection = ({
  onPlanRequest,
  isAuthenticated,
  currentSubscription,
  isLoadingSubscription = false,
  showPlans = true,
}: PlansPromotionSectionProps) => {
  const hasSubscription = Boolean(currentSubscription);
  const currentPlanTier = currentSubscription
    ? API_TIER_TO_SITE_TIER[currentSubscription.plan.tier]
    : null;

  return (
    <section id="plans" className="relative bg-gray-900 py-24 text-white md:py-28 lg:py-32">
      <div className="container mx-auto px-6">
        {showPlans && (
          <>
            <div className="mb-10 md:mb-12">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
                Plans
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase italic tracking-tight sm:text-4xl">
                {hasSubscription ? "Manage Your Plan" : "Choose Your Lawn Plan"}
              </h2>
              <p className="mt-3 max-w-2xl text-gray-400">
                {hasSubscription
                  ? "Your current subscription is below. Compare tiers if you want to change coverage."
                  : "Start with a monthly plan and activate service after secure Stripe checkout."}
              </p>
            </div>

            {isAuthenticated && isLoadingSubscription && (
              <div className="mb-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-gray-800/40 px-5 py-4 text-sm text-gray-300">
                <Loader2 size={16} className="animate-spin text-orange-400" />
                Loading your subscription details...
              </div>
            )}

            {hasSubscription && currentSubscription && (
              <div className="mb-10 rounded-3xl border border-orange-400/25 bg-gradient-to-br from-gray-800 to-gray-900 p-7 shadow-2xl shadow-black/35 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.32em] text-orange-300">
                      My plan
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-white md:text-4xl">
                      {currentSubscription.plan.name}
                    </h3>
                    <p className="mt-2 text-gray-300">
                      {formatMoney(currentSubscription.plan.priceInCents)} / month
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${STATUS_META[currentSubscription.status].className}`}
                  >
                    {STATUS_META[currentSubscription.status].label}
                  </span>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                      Commitment ends
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-200">
                      <Clock3 size={14} className="text-orange-300" />
                      {formatDate(currentSubscription.endDate)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                      Property
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-200">
                      <Home size={14} className="text-orange-300" />
                      {currentSubscription.property.city}, {currentSubscription.property.state}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                      Billing source
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-200">
                      <ShieldCheck size={14} className="text-orange-300" />
                      Stripe subscription
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div id="plan-options" className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
          {LAWN_MAINTENANCE_PLANS.map((plan) => {
            const isStandard = plan.tier === "Standard Plan";
            const isCurrentPlan = currentPlanTier === plan.tier;
            const isFeatured = isCurrentPlan || (!hasSubscription && isStandard);
            const price = plan.priceLabel.replace("/month", "");

            return (
              <article
                key={plan.tier}
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
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full bg-lime-500 px-5 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-widest text-gray-950">
                      Recommended
                    </div>
                  )
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

                  <ul className="mb-10 space-y-4">
                    <li className="flex items-center gap-3 text-gray-300">
                      <CheckCircle
                        size={18}
                        className={isFeatured ? "text-lime-400" : "text-amber-400/70"}
                        fill={isFeatured ? "currentColor" : "none"}
                        strokeWidth={isFeatured ? 0 : 2}
                      />
                      {plan.maxSqFtLabel}
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <CheckCircle
                        size={18}
                        className={isFeatured ? "text-lime-400" : "text-amber-400/70"}
                        fill={isFeatured ? "currentColor" : "none"}
                        strokeWidth={isFeatured ? 0 : 2}
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
                          className={isFeatured ? "text-lime-400" : "text-amber-400/70"}
                          fill={isFeatured ? "currentColor" : "none"}
                          strokeWidth={isFeatured ? 0 : 2}
                        />
                        {feature}
                      </li>
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
                  {isCurrentPlan
                    ? "Current Plan"
                    : hasSubscription
                      ? `Change to ${plan.tier.replace(" Plan", "")}`
                      : isStandard
                        ? `Get ${plan.tier}`
                        : `Select ${plan.tier.replace(" Plan", "")}`}
                </button>

                {hasSubscription && !isCurrentPlan && (
                  <p className="mt-3 text-center text-xs text-gray-500">
                    We will open a new checkout flow to confirm the plan change.
                  </p>
                )}
              </article>
            );
          })}
            </div>
          </>
        )}

        <div className={showPlans ? "mt-16 md:mt-20" : ""}>
          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-2">
            <div className="flex flex-col items-center justify-between gap-8 rounded-xl border border-gray-700/30 bg-gray-800/40 px-8 py-10 md:flex-row md:px-12 md:py-12">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-lime-500/30 bg-lime-500/10">
                  <Tag size={30} className="text-lime-400" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white md:text-3xl">
                    {hasSubscription
                      ? "INVITE 3 NEW CUSTOMERS AND EARN A FREE MONTH ON YOUR CURRENT PLAN."
                      : REFERRAL_PROMOTION.headline
                          .split("get 1 month of landscape free")
                          .map((part, i) =>
                            i === 0 ? (
                              <span key={i}>
                                {part.toUpperCase()}
                                <span className="text-lime-400">GET 1 MONTH FREE.</span>
                              </span>
                            ) : null,
                          )}
                  </h4>
                  <p className="mt-2 text-gray-400">
                    {hasSubscription
                      ? "Keep your plan running and reduce your cost with referral rewards."
                      : REFERRAL_PROMOTION.helperText}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-lime-500 px-8 py-4 font-bold text-gray-950 shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <ArrowRightLeft size={18} />
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
