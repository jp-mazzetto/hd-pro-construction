import type { ReactNode } from "react";
import { Clock3, Home, ShieldCheck } from "lucide-react";

import { STATUS_META, formatDate, formatMoney } from "../../../consts/plans-promotion";
import type { UserSubscription } from "../../../types/lib";

interface CurrentSubscriptionCardProps {
  subscription: UserSubscription;
}

interface SubscriptionDetailItemProps {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}

/**
 * Card com dados resumidos da assinatura atual do usuario.
 */
export const CurrentSubscriptionCard = ({
  subscription,
}: CurrentSubscriptionCardProps) => (
  <div className="mb-10 rounded-3xl border border-orange-400/25 bg-linear-to-br from-gray-800 to-gray-900 p-7 shadow-2xl shadow-black/35 md:p-8">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-orange-300">
          My plan
        </p>
        <h3 className="mt-2 text-3xl font-black text-white md:text-4xl">
          {subscription.plan.name}
        </h3>
        <p className="mt-2 text-gray-300">
          {formatMoney(subscription.plan.priceInCents)} / month
        </p>
      </div>

      <span
        className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${STATUS_META[subscription.status].className}`}
      >
        {STATUS_META[subscription.status].label}
      </span>
    </div>

    <div className="mt-7 grid gap-4 md:grid-cols-3">
      <SubscriptionDetailItem
        label="Commitment ends"
        icon={<Clock3 size={14} className="text-orange-300" />}
      >
        {formatDate(subscription.endDate)}
      </SubscriptionDetailItem>

      <SubscriptionDetailItem
        label="Property"
        icon={<Home size={14} className="text-orange-300" />}
      >
        {subscription.property
          ? `${subscription.property.city}, ${subscription.property.state}`
          : "Address pending"}
      </SubscriptionDetailItem>

      <SubscriptionDetailItem
        label="Billing source"
        icon={<ShieldCheck size={14} className="text-orange-300" />}
      >
        Stripe subscription
      </SubscriptionDetailItem>
    </div>
  </div>
);

/**
 * Item padrao para metadados de assinatura.
 */
const SubscriptionDetailItem = ({
  label,
  icon,
  children,
}: SubscriptionDetailItemProps) => (
  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
      {label}
    </p>
    <p className="mt-2 flex items-center gap-2 text-sm text-gray-200">
      {icon}
      {children}
    </p>
  </div>
);
