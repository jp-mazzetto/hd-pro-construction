import { BadgeCheck, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

import type { SubscriptionPlan } from "../../types/lib";

interface PlanSummaryProps {
  plan: SubscriptionPlan;
}

const INPUT_BASE_CLASSES =
  "w-full rounded-2xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-400 focus:bg-black/30 focus:ring-2 focus:ring-orange-500/20";

export const PlanSummary = ({ plan }: PlanSummaryProps) => {
  const price = `$${(plan.priceInCents / 100).toFixed(0)}`;

  return (
    <aside className="order-2 lg:order-1">
      <div className="sticky top-6 overflow-hidden rounded-3xl border border-white/15 bg-black/30 shadow-2xl shadow-black/35 backdrop-blur-xl">
        <div className="border-b border-white/10 bg-gradient-to-r from-orange-500/25 via-orange-400/10 to-transparent px-6 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-200">
            Selected plan
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-[0.04em] text-white">
              {plan.tier}
            </h2>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-['Bebas_Neue'] text-6xl leading-none tracking-[0.02em] text-orange-400">
                {price}
              </span>
              <span className="pb-2 text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                /month
              </span>
            </div>
          </div>

          <ul className="space-y-2.5 text-sm text-gray-200">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 text-orange-300" />
              Up to {plan.maxSqFt.toLocaleString()} sq ft
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 text-orange-300" />
              {plan.visitsPerMonth} visits per month
            </li>
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-orange-300" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-gray-400">
              What happens next
            </p>
            <ul className="mt-3 space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-orange-300" />
                Stripe confirms payment
              </li>
              <li className="flex items-center gap-2">
                <Clock3 size={14} className="text-orange-300" />
                Subscription activates instantly
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-orange-300" />
                12-month commitment maintained
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};
