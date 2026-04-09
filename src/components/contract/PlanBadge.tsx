import type { SubscriptionPlan } from "../../types/lib";
import { fmt, ordinal } from "../../utils/contract";

interface PlanBadgeProps {
  plan: SubscriptionPlan;
  billingDay: number;
}

export default function PlanBadge({ plan, billingDay }: PlanBadgeProps) {
  const monthly = fmt(plan.priceInCents);
  const total = fmt(plan.priceInCents * 12);

  const cells = [
    { label: "Plan", value: plan.name },
    { label: "Monthly", value: monthly },
    { label: "Total (12 mo)", value: total },
    { label: "Billing day", value: `${ordinal(billingDay)} of each month` },
  ];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm">
      <div className="border-b border-white/8 bg-orange-500/10 px-5 py-3">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-300">
          Selected Plan
        </p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
        {cells.map(({ label, value }) => (
          <div key={label} className="bg-slate-950 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
