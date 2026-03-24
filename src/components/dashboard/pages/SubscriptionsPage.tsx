import { useEffect, useState } from "react";
import { Home, Plus } from "lucide-react";

import type { DashboardSection } from "../../../types/dashboard";
import type { UserSubscription } from "../../../types/lib";
import { fetchSubscriptions } from "../../../lib/dashboard-client";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";

interface SubscriptionsPageProps {
  onNavigate: (section: DashboardSection, params?: Record<string, string>) => void;
  onNavigateToPlans: () => void;
}

export default function SubscriptionsPage({
  onNavigate,
  onNavigateToPlans,
}: SubscriptionsPageProps) {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const subs = await fetchSubscriptions();
        if (!cancelled) setSubscriptions(subs);
      } catch {
        if (!cancelled) setError("Failed to load subscriptions.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`sk-${i}`} className="h-28 animate-pulse rounded-xl bg-slate-900" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (subscriptions.length === 0) {
    return (
      <EmptyState
        icon={<Home size={28} />}
        title="No Plans Yet"
        description="Subscribe to a lawn maintenance plan to get started with regular service."
        action={
          <button
            type="button"
            onClick={onNavigateToPlans}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
          >
            <Plus size={16} /> Choose a Plan
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {subscriptions.map((sub) => (
        <button
          key={sub.id}
          type="button"
          onClick={() => onNavigate("subscription-detail", { id: sub.id })}
          className="flex w-full items-start justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 text-left transition-colors hover:border-slate-700 cursor-pointer"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-base font-bold text-white">{sub.plan.name}</span>
              <StatusBadge status={sub.status} />
            </div>
            <div className="text-sm text-slate-400">
              {sub.property.street}, {sub.property.city}, {sub.property.state}{" "}
              {sub.property.zipCode}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>
                ${(sub.plan.priceInCents / 100).toFixed(0)}/mo
              </span>
              <span>{sub.plan.visitsPerMonth} visits/month</span>
              <span>Up to {sub.plan.maxSqFt.toLocaleString()} sq ft</span>
              <span>
                {new Date(sub.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                &ndash;{" "}
                {new Date(sub.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
