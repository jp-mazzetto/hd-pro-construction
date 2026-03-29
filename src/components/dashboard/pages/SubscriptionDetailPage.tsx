import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, Loader2, XCircle } from "lucide-react";

import type { DashboardSection } from "../../../types/dashboard";
import type { Property, UserSubscription } from "../../../types/lib";
import {
	fetchSubscription,
	cancelSubscription,
	fetchProperties,
	linkSubscriptionProperty,
	resumeCheckout,
} from "../../../lib/dashboard-client";
import StatusBadge from "../shared/StatusBadge";

interface SubscriptionDetailPageProps {
  subscriptionId: string;
  onNavigate: (section: DashboardSection, params?: Record<string, string>) => void;
}

export default function SubscriptionDetailPage({
  subscriptionId,
  onNavigate,
}: SubscriptionDetailPageProps) {
  const [sub, setSub] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isLinkingProperty, setIsLinkingProperty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchSubscription(subscriptionId);
        if (cancelled) return;
        setSub(data);

        if (!data.property) {
          const userProperties = await fetchProperties().catch(() => []);
          if (cancelled) return;
          setProperties(userProperties);
          if (userProperties.length > 0) {
            setSelectedPropertyId(userProperties[0].id);
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load subscription details.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [subscriptionId]);

  const handleResumeCheckout = useCallback(async () => {
    if (!sub) return;
    setIsResuming(true);
    try {
      const result = await resumeCheckout(sub.id);
      if (result.status === "activated") {
        const updated = await fetchSubscription(sub.id);
        setSub(updated);
      } else if (result.status === "checkout_url" && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch {
      setError("Failed to resume checkout.");
    } finally {
      setIsResuming(false);
    }
  }, [sub]);

  const handleCancel = useCallback(async () => {
    if (!sub) return;
    setIsCancelling(true);

    try {
      const updated = await cancelSubscription(sub.id, cancelReason || undefined);
      setSub(updated);
      setShowCancelConfirm(false);
    } catch {
      setError("Failed to cancel subscription.");
    } finally {
      setIsCancelling(false);
    }
  }, [sub, cancelReason]);

  const handleLinkProperty = useCallback(async () => {
    if (!sub || !selectedPropertyId) return;

    setIsLinkingProperty(true);
    setError(null);
    try {
      const updated = await linkSubscriptionProperty(sub.id, selectedPropertyId);
      setSub(updated);
    } catch {
      setError("Failed to link property to this subscription.");
    } finally {
      setIsLinkingProperty(false);
    }
  }, [sub, selectedPropertyId]);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-900" />;
  }

  if (error || !sub) {
    return <p className="text-sm text-red-400">{error ?? "Subscription not found."}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate("overview")}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-black text-white">{sub.plan.name}</h2>
        <StatusBadge
          status={sub.lifecycleState === "END_SCHEDULED" ? "END_SCHEDULED" : sub.status}
        />
      </div>

      {/* Info grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Plan Details
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Price</dt>
              <dd className="font-semibold text-white">
                ${(sub.plan.priceInCents / 100).toFixed(0)}/mo
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Visits</dt>
              <dd className="font-semibold text-white">
                {sub.plan.visitsPerMonth}/month
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Max Area</dt>
              <dd className="font-semibold text-white">
                {sub.plan.maxSqFt.toLocaleString()} sq ft
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Period</dt>
              <dd className="font-semibold text-white">
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
              </dd>
            </div>
          </dl>
          {sub.plan.features.length > 0 && (
            <ul className="mt-4 space-y-1 border-t border-slate-800 pt-3">
              {sub.plan.features.map((f) => (
                <li key={f} className="text-xs text-slate-400">
                  &bull; {f}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Property
          </h3>
          {sub.property ? (
            <>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Address</dt>
                  <dd className="font-semibold text-white text-right">
                    {sub.property.street}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">City</dt>
                  <dd className="font-semibold text-white">
                    {sub.property.city}, {sub.property.state} {sub.property.zipCode}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Size</dt>
                  <dd className="font-semibold text-white">
                    {sub.property.sqFt.toLocaleString()} sq ft
                  </dd>
                </div>
              </dl>
              {sub.property.notes && (
                <p className="mt-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
                  {sub.property.notes}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-amber-300">
                Address not linked yet. This must be completed before schedule setup.
              </p>
              {properties.length > 0 ? (
                <>
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                  >
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.street} - {property.city}, {property.state}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleLinkProperty}
                    disabled={isLinkingProperty || !selectedPropertyId}
                    className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isLinkingProperty ? "Linking..." : "Link Address"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate("properties")}
                  className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 cursor-pointer"
                >
                  Add Address First
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {sub.status === "PENDING" && (
          <button
            type="button"
            onClick={handleResumeCheckout}
            disabled={isResuming}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
          >
            {isResuming ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <ExternalLink size={16} />
                Complete Payment
              </>
            )}
          </button>
        )}

        {sub.status === "ACTIVE" && sub.lifecycleState !== "END_SCHEDULED" && sub.property && (
          <button
            type="button"
            onClick={() =>
              onNavigate("schedule-setup", { id: sub.id })
            }
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 cursor-pointer"
          >
            <CalendarDays size={16} /> Set Up Schedule
          </button>
        )}

        {sub.status === "ACTIVE" && sub.lifecycleState !== "END_SCHEDULED" && (
          <button
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 cursor-pointer"
          >
            <XCircle size={16} /> Cancel Subscription
          </button>
        )}
      </div>

      {/* Cancellation scheduled notice */}
      {sub.lifecycleState === "END_SCHEDULED" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-300">Cancellation scheduled</p>
          <p className="mt-1 text-xs text-slate-400">
            Your subscription will remain active until{" "}
            <span className="text-white">
              {new Date(sub.endDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            . No further charges will be made after that date.
          </p>
        </div>
      )}

      {/* Cancel confirmation */}
      {showCancelConfirm && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <h3 className="mb-2 text-sm font-bold text-red-400">
            Confirm Cancellation
          </h3>
          <p className="mb-3 text-xs text-slate-400">
            This will cancel your subscription immediately and stop upcoming
            scheduled services.
          </p>
          <textarea
            placeholder="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCancelling}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancel"}
            </button>
            <button
              type="button"
              onClick={() => setShowCancelConfirm(false)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Keep Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
