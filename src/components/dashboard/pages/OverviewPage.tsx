import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Gift,
  Home,
  Loader2,
  MapPin,
  Plus,
  Share2,
  Trash2,
  X,
} from "lucide-react";

import type { DashboardSection, ReferralStatus, ServiceVisit } from "../../../types/dashboard";
import type { Property, UserSubscription } from "../../../types/lib";
import {
  fetchSubscriptions,
  fetchVisits,
  fetchReferralStatus,
  fetchProperties,
  createProperty,
  deleteProperty,
  generateReferralCode,
  resumeCheckout,
} from "../../../lib/dashboard-client";
import StatCard from "../shared/StatCard";
import StatusBadge from "../shared/StatusBadge";

interface PropertyFormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  sqFt: string;
  notes: string;
}

const INITIAL_FORM: PropertyFormData = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  sqFt: "",
  notes: "",
};

interface OverviewPageProps {
  onNavigate: (section: DashboardSection, params?: Record<string, string>) => void;
  onNavigateToPlans: () => void;
}

export default function OverviewPage({
  onNavigate,
  onNavigateToPlans,
}: OverviewPageProps) {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [visits, setVisits] = useState<ServiceVisit[]>([]);
  const [referral, setReferral] = useState<ReferralStatus | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Property form
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [propertyForm, setPropertyForm] = useState<PropertyFormData>(INITIAL_FORM);
  const [isSubmittingProperty, setIsSubmittingProperty] = useState(false);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  // Resume checkout
  const [resumingSubId, setResumingSubId] = useState<string | null>(null);

  // Referral
  const [copied, setCopied] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [subs, vis, ref, props] = await Promise.all([
        fetchSubscriptions().catch(() => []),
        fetchVisits({ status: "SCHEDULED" }).catch(() => []),
        fetchReferralStatus().catch(() => null),
        fetchProperties().catch(() => []),
      ]);
      setSubscriptions(subs);
      setVisits(vis);
      setReferral(ref);
      setProperties(props);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Property handlers
  const handleSubmitProperty = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmittingProperty(true);
      setPropertyError(null);
      try {
        await createProperty({
          street: propertyForm.street.trim(),
          city: propertyForm.city.trim(),
          state: propertyForm.state.trim().toUpperCase(),
          zipCode: propertyForm.zipCode.trim(),
          sqFt: Number(propertyForm.sqFt),
          notes: propertyForm.notes.trim() || undefined,
        });
        setPropertyForm(INITIAL_FORM);
        setShowPropertyForm(false);
        const props = await fetchProperties().catch(() => []);
        setProperties(props);
      } catch {
        setPropertyError("Failed to create property.");
      } finally {
        setIsSubmittingProperty(false);
      }
    },
    [propertyForm],
  );

  const handleDeleteProperty = useCallback(async (id: string) => {
    setDeletingPropertyId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setPropertyError("Failed to delete. It may have an active subscription.");
    } finally {
      setDeletingPropertyId(null);
    }
  }, []);

  const handleResumeCheckout = useCallback(async (e: React.MouseEvent, subId: string) => {
    e.stopPropagation();
    setResumingSubId(subId);
    try {
      const result = await resumeCheckout(subId);
      if (result.status === "activated") {
        // Reload subscriptions to reflect the new status
        const subs = await fetchSubscriptions().catch(() => []);
        setSubscriptions(subs);
      } else if (result.status === "checkout_url" && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch {
      // Fallback: navigate to subscription detail
    } finally {
      setResumingSubId(null);
    }
  }, []);

  // Referral handlers
  const handleCopyCode = useCallback(async () => {
    if (!referral?.referralCode) return;
    await navigator.clipboard.writeText(referral.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referral]);

  const handleGenerateCode = useCallback(async () => {
    setIsGeneratingCode(true);
    try {
      const { referralCode } = await generateReferralCode();
      setReferral((prev) => prev ? { ...prev, referralCode } : null);
    } catch {
      // Ignore generation errors here; the current dashboard avoids noisy referral alerts.
    }
    finally {
      setIsGeneratingCode(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="h-24 animate-pulse rounded-xl bg-slate-900" />
        ))}
      </div>
    );
  }

  const activeSubs = subscriptions.filter((s) => s.status === "ACTIVE");
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
  );
  const nextVisit = sortedVisits[0] ?? null;

  const referralProgress = referral
    ? referral.converted % 3
    : 0;

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Plans"
          value={activeSubs.length}
          icon={<Home size={20} />}
          accent
        />
        <StatCard
          label="Next Visit"
          value={
            nextVisit
              ? new Date(nextVisit.scheduledDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
          icon={<CalendarDays size={20} />}
        />
        <StatCard
          label="Referral Progress"
          value={`${referralProgress}/3`}
          icon={<Gift size={20} />}
        />
        <StatCard
          label="Free Months Earned"
          value={referral?.freeMonthsEarned ?? 0}
          icon={<CreditCard size={20} />}
        />
      </div>

      {/* ── My Plans ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
          My Plans
        </h2>
        {subscriptions.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
            <p className="mb-3 text-sm text-slate-400">No plans yet.</p>
            <button
              type="button"
              onClick={onNavigateToPlans}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700"
            >
              <Plus size={16} /> Choose a Plan
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => onNavigate("subscription-detail", { id: sub.id })}
                  className="flex w-full items-start justify-between text-left cursor-pointer"
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
                      <span>${(sub.plan.priceInCents / 100).toFixed(0)}/mo</span>
                      <span>{sub.plan.visitsPerMonth} visits/month</span>
                      <span>Up to {sub.plan.maxSqFt.toLocaleString()} sq ft</span>
                    </div>
                  </div>
                </button>
                {sub.status === "PENDING" && (
                  <button
                    type="button"
                    onClick={(e) => handleResumeCheckout(e, sub.id)}
                    disabled={resumingSubId === sub.id}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    {resumingSubId === sub.id ? (
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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── My Properties ────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            My Properties
          </h2>
          <button
            type="button"
            onClick={() => setShowPropertyForm(!showPropertyForm)}
            className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 cursor-pointer"
          >
            {showPropertyForm ? <X size={14} /> : <Plus size={14} />}
            {showPropertyForm ? "Cancel" : "Add"}
          </button>
        </div>

        {propertyError && (
          <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">
            {propertyError}
          </div>
        )}

        {showPropertyForm && (
          <form
            onSubmit={handleSubmitProperty}
            className="mb-3 rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text" placeholder="Street address" value={propertyForm.street}
                onChange={(e) => setPropertyForm((p) => ({ ...p, street: e.target.value }))}
                required minLength={3}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
              <input
                type="text" placeholder="City" value={propertyForm.city}
                onChange={(e) => setPropertyForm((p) => ({ ...p, city: e.target.value }))}
                required minLength={2}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
              <input
                type="text" placeholder="State (e.g. MA)" value={propertyForm.state}
                onChange={(e) => setPropertyForm((p) => ({ ...p, state: e.target.value }))}
                required maxLength={2}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
              <input
                type="text" placeholder="Zip Code" value={propertyForm.zipCode}
                onChange={(e) => setPropertyForm((p) => ({ ...p, zipCode: e.target.value }))}
                required pattern="^\d{5}(-\d{4})?$"
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
              <input
                type="number" placeholder="Size (sq ft)" value={propertyForm.sqFt}
                onChange={(e) => setPropertyForm((p) => ({ ...p, sqFt: e.target.value }))}
                required min={100} max={50000}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
              <input
                type="text" placeholder="Notes (optional)" value={propertyForm.notes}
                onChange={(e) => setPropertyForm((p) => ({ ...p, notes: e.target.value }))}
                maxLength={500}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button
              type="submit" disabled={isSubmittingProperty}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmittingProperty ? "Saving..." : "Save Property"}
            </button>
          </form>
        )}

        {properties.length === 0 && !showPropertyForm ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
            <MapPin size={24} className="mx-auto mb-2 text-slate-500" />
            <p className="text-sm text-slate-400">No properties added yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-bold text-white">{prop.street}</div>
                  <div className="text-xs text-slate-400">
                    {prop.city}, {prop.state} {prop.zipCode} &middot;{" "}
                    {prop.sqFt.toLocaleString()} sq ft
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteProperty(prop.id)}
                  disabled={deletingPropertyId === prop.id}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                  title="Delete property"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Upcoming Visits ──────────────────────────────────────── */}
      {sortedVisits.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Upcoming Visits
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("schedule")}
              className="flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 cursor-pointer"
            >
              View schedule
            </button>
          </div>
          <div className="space-y-2">
            {sortedVisits.slice(0, 3).map((visit) => (
              <div
                key={visit.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">
                    {new Date(visit.scheduledDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-slate-400">
                    {visit.timeWindow === "MORNING" && "7:00 AM – 11:00 AM"}
                    {visit.timeWindow === "MIDDAY" && "11:00 AM – 2:00 PM"}
                    {visit.timeWindow === "AFTERNOON" && "2:00 PM – 6:00 PM"}
                  </div>
                </div>
                <StatusBadge status={visit.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Referral Program ─────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
          Referral Program
        </h2>
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-slate-900 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
              <Gift size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Refer 3, Get 1 Month Free</div>
              <div className="text-xs text-slate-400">
                Share your code with friends and earn free months.
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Progress</span>
              <span>{referralProgress}/3 referrals</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${(referralProgress / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Referral code */}
          {referral?.referralCode ? (
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-slate-800 px-3 py-2 font-mono text-sm font-bold tracking-widest text-orange-400">
                {referral.referralCode}
              </code>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGenerateCode}
              disabled={isGeneratingCode}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
            >
              <Share2 size={14} />
              {isGeneratingCode ? "Generating..." : "Generate Code"}
            </button>
          )}

          {/* Stats row */}
          {referral && (
            <div className="mt-4 flex gap-6 border-t border-slate-800 pt-3">
              <div>
                <div className="text-lg font-black text-white">{referral.total}</div>
                <div className="text-xs text-slate-500">Referred</div>
              </div>
              <div>
                <div className="text-lg font-black text-white">{referral.converted}</div>
                <div className="text-xs text-slate-500">Converted</div>
              </div>
              <div>
                <div className="text-lg font-black text-emerald-400">{referral.freeMonthsEarned}</div>
                <div className="text-xs text-slate-500">Free Months</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
