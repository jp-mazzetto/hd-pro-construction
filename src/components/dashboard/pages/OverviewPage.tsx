import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  invalidateCheckoutQueries,
  invalidatePropertyAndSubscriptionQueries,
  invalidateReferralQueries,
} from "../../../lib/query-invalidations";
import { queryKeys } from "../../../lib/query-keys";
import usePropertyForm from "../../../hooks/usePropertyForm";
import StatCard from "../shared/StatCard";
import StatusBadge from "../shared/StatusBadge";
import PropertyFormFields from "../../properties/PropertyFormFields";

interface OverviewPageProps {
  onNavigate: (section: DashboardSection, params?: Record<string, string>) => void;
  onNavigateToPlans: () => void;
}

export default function OverviewPage({
  onNavigate,
  onNavigateToPlans,
}: OverviewPageProps) {
  const queryClient = useQueryClient();

  // Property form
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const {
    form: propertyForm,
    resetForm: resetPropertyForm,
    handleFieldChange: handlePropertyFieldChange,
    zipLookupMessage,
    onZipCodeBlur,
  } = usePropertyForm();

  // Resume checkout
  const [resumingSubId, setResumingSubId] = useState<string | null>(null);

  // Referral
  const [copied, setCopied] = useState(false);

  const subscriptionsQuery = useQuery({
    queryKey: queryKeys.subscriptions.all,
    queryFn: fetchSubscriptions,
    staleTime: 60 * 1000,
  });

  const visitsQuery = useQuery({
    queryKey: queryKeys.visits.list({ status: "SCHEDULED" }),
    queryFn: () => fetchVisits({ status: "SCHEDULED" }),
    staleTime: 60 * 1000,
  });

  const referralQuery = useQuery({
    queryKey: queryKeys.referral.status,
    queryFn: fetchReferralStatus,
    staleTime: 60 * 1000,
  });

  const propertiesQuery = useQuery({
    queryKey: queryKeys.properties.all,
    queryFn: fetchProperties,
    staleTime: 60 * 1000,
  });

  const createPropertyMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: async () => {
      await invalidatePropertyAndSubscriptionQueries(queryClient);
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: async () => {
      await invalidatePropertyAndSubscriptionQueries(queryClient);
    },
  });

  const resumeCheckoutMutation = useMutation({
    mutationFn: resumeCheckout,
    onSuccess: async (result) => {
      if (result.status === "activated") {
        await invalidateCheckoutQueries(queryClient);
      }
    },
  });

  const generateReferralCodeMutation = useMutation({
    mutationFn: generateReferralCode,
    onSuccess: async ({ referralCode }) => {
      queryClient.setQueryData<ReferralStatus | null>(queryKeys.referral.status, (current) =>
        current ? { ...current, referralCode } : current,
      );
      await invalidateReferralQueries(queryClient);
    },
  });

  // Property handlers
  const handleSubmitProperty = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPropertyError(null);
      try {
        await createPropertyMutation.mutateAsync({
          street: propertyForm.street.trim(),
          city: propertyForm.city.trim(),
          state: propertyForm.state.trim().toUpperCase(),
          zipCode: propertyForm.zipCode.trim(),
          sqFt: Number(propertyForm.sqFt),
          notes: propertyForm.notes.trim() || undefined,
        });
        resetPropertyForm();
        setShowPropertyForm(false);
      } catch {
        setPropertyError("Failed to create property.");
      }
    },
    [createPropertyMutation, propertyForm, resetPropertyForm],
  );

  const handleDeleteProperty = useCallback(async (id: string) => {
    setDeletingPropertyId(id);
    try {
      await deletePropertyMutation.mutateAsync(id);
    } catch {
      setPropertyError("Failed to delete. This address may be linked to a plan.");
    } finally {
      setDeletingPropertyId(null);
    }
  }, [deletePropertyMutation]);

  const handleResumeCheckout = useCallback(async (e: React.MouseEvent, subId: string) => {
    e.stopPropagation();
    setResumingSubId(subId);
    try {
      const result = await resumeCheckoutMutation.mutateAsync(subId);
      if (result.status === "checkout_url" && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch {
      // Fallback: navigate to subscription detail
    } finally {
      setResumingSubId(null);
    }
  }, [resumeCheckoutMutation]);

  // Referral handlers
  const handleCopyCode = useCallback(async () => {
    if (!referralQuery.data?.referralCode) return;
    await navigator.clipboard.writeText(referralQuery.data.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referralQuery.data?.referralCode]);

  const handleGenerateCode = useCallback(async () => {
    try {
      await generateReferralCodeMutation.mutateAsync();
    } catch {
      // Ignore generation errors silently
    }
  }, [generateReferralCodeMutation]);

  const subscriptions: UserSubscription[] = subscriptionsQuery.data ?? [];
  const visits: ServiceVisit[] = visitsQuery.data ?? [];
  const referral: ReferralStatus | null = referralQuery.data ?? null;
  const properties: Property[] = propertiesQuery.data ?? [];

  const hasLoadFailures = useMemo(
    () =>
      subscriptionsQuery.isError ||
      visitsQuery.isError ||
      referralQuery.isError ||
      propertiesQuery.isError,
    [
      subscriptionsQuery.isError,
      visitsQuery.isError,
      referralQuery.isError,
      propertiesQuery.isError,
    ],
  );

  const loadError = hasLoadFailures
    ? "Some dashboard data could not be loaded. Please refresh and try again."
    : null;

  const isLoading =
    subscriptionsQuery.isPending ||
    visitsQuery.isPending ||
    referralQuery.isPending ||
    propertiesQuery.isPending;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="h-24 animate-pulse rounded-xl"
            style={{ backgroundColor: "#171f33" }}
          />
        ))}
      </div>
    );
  }

  const trulyActiveSubs = subscriptions.filter((s) => s.lifecycleState === "ACTIVE");
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
  );
  const nextVisit = sortedVisits[0] ?? null;

  const referralProgress = referral ? referral.converted % 3 : 0;

  return (
    <div className="space-y-8">
      {loadError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {loadError}
        </div>
      )}

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Plans"
          value={trulyActiveSubs.length}
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

      {/* ── Bento grid: 2/3 left + 1/3 right ────────────────────── */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

        {/* Left column — Plans & Properties */}
        <div className="space-y-8 xl:col-span-2">

          {/* My Plans */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-['Manrope'] text-2xl font-bold text-white">My Plans</h2>
              {subscriptions.length > 0 && (
                <button
                  type="button"
                  onClick={onNavigateToPlans}
                  className="rounded-lg border border-orange-400/40 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200 hover:bg-orange-500/20 cursor-pointer"
                >
                  Add a new plan to a new address.
                </button>
              )}
            </div>

            {subscriptions.length === 0 || trulyActiveSubs.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#171f33" }}>
                <p className="mb-4 text-sm text-slate-400">
                  {subscriptions.length === 0
                    ? "No plans yet. Start protecting your property today."
                    : "Your current plan is scheduled to end. Add a new plan to keep your service going."}
                </p>
                <button
                  type="button"
                  onClick={onNavigateToPlans}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
                >
                  <Plus size={16} /> Choose a Plan
                </button>
              </div>
            ) : null}

            {subscriptions.length > 0 && (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="overflow-hidden rounded-xl border border-slate-800/40 group"
                    style={{ backgroundColor: "#171f33" }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left accent panel */}
                      <div className="relative flex shrink-0 items-center justify-center overflow-hidden bg-linear-to-br from-orange-500/20 to-transparent md:w-2 md:items-stretch" />

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <button
                          type="button"
                          onClick={() => onNavigate("subscription-detail", { id: sub.id })}
                          className="flex w-full items-start justify-between text-left cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-3">
                              <span className="font-['Manrope'] text-xl font-bold text-white">
                                {sub.plan.name}
                              </span>
                              <StatusBadge
                                status={sub.lifecycleState === "END_SCHEDULED" ? "END_SCHEDULED" : sub.status}
                              />
                            </div>
                            <p className="flex items-center gap-1.5 text-sm text-slate-400">
                              <MapPin size={12} className="shrink-0" />
                              {sub.property
                                ? `${sub.property?.street}, ${sub.property?.city}, ${sub.property?.state} ${sub.property?.zipCode}`
                                : "Address pending: link this plan to a property"}
                            </p>
                          </div>
                        </button>

                        <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Price</p>
                            <p className="font-['Manrope'] text-2xl font-bold text-[#ffb690]">
                              ${(sub.plan.priceInCents / 100).toFixed(0)}
                              <span className="text-sm font-normal text-slate-400">/mo</span>
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Visits</p>
                            <p className="text-lg font-semibold text-white">{sub.plan.visitsPerMonth}×/month</p>
                          </div>
                        </div>

                        {sub.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={(e) => handleResumeCheckout(e, sub.id)}
                            disabled={resumingSubId === sub.id}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer transition-colors"
                          >
                            {resumingSubId === sub.id ? (
                              <><Loader2 size={16} className="animate-spin" /> Checking...</>
                            ) : (
                              <><ExternalLink size={16} /> Complete Payment</>
                            )}
                          </button>
                        )}

                        {sub.status === "ACTIVE" && !sub.property && (
                          <button
                            type="button"
                            onClick={() => onNavigate("subscription-detail", { id: sub.id })}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2.5 text-sm font-bold text-amber-200 hover:bg-amber-500/20 cursor-pointer transition-colors"
                          >
                            <MapPin size={16} /> Link Address Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Properties */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-['Manrope'] text-2xl font-bold text-white">My Properties</h2>
              <button
                type="button"
                onClick={() => setShowPropertyForm(!showPropertyForm)}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold cursor-pointer transition-colors"
                style={{
                  backgroundColor: showPropertyForm ? "transparent" : "#f97316",
                  color: showPropertyForm ? "#e0c0b1" : "#552100",
                  border: showPropertyForm ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                {showPropertyForm ? <X size={14} /> : <Plus size={14} />}
                {showPropertyForm ? "Cancel" : "Add Property"}
              </button>
            </div>

            {propertyError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {propertyError}
              </div>
            )}

            {showPropertyForm && (
              <form
                onSubmit={handleSubmitProperty}
                className="mb-4 space-y-3 rounded-xl border border-slate-800/40 p-5"
                style={{ backgroundColor: "#171f33" }}
              >
                <PropertyFormFields
                  form={propertyForm}
                  onFieldChange={handlePropertyFieldChange}
                  onZipCodeBlur={onZipCodeBlur}
                  zipLookupMessage={zipLookupMessage}
                  sqFtPlaceholder="Size (sq ft)"
                />
                <button
                  type="submit"
                  disabled={createPropertyMutation.isPending}
                  className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
                >
                  {createPropertyMutation.isPending ? "Saving..." : "Save Property"}
                </button>
              </form>
            )}

            {properties.length === 0 && !showPropertyForm ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{ backgroundColor: "#171f33" }}
              >
                <MapPin size={28} className="mx-auto mb-3 text-slate-500" />
                <p className="text-sm text-slate-400">No properties added yet.</p>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#171f33" }}>
                {properties.map((prop, idx) => (
                  <div
                    key={prop.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/40 transition-colors"
                    style={idx !== 0 ? { borderTop: "1px solid rgba(255,255,255,0.06)" } : undefined}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-[#ffb690]"
                        style={{ backgroundColor: "#222a3d" }}
                      >
                        <Home size={18} />
                      </div>
                      <div>
                        <div className="font-['Manrope'] font-bold text-white">{prop.street}</div>
                        <div className="text-xs text-slate-400">
                          {prop.city}, {prop.state} {prop.zipCode} &middot;{" "}
                          {prop.sqFt.toLocaleString()} sq ft
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(prop.id)}
                      disabled={deletingPropertyId === prop.id}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 cursor-pointer transition-colors"
                      title="Delete property"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column — Visits & Referral */}
        <div className="space-y-8">

          {/* Upcoming Visits */}
          <section
            className="rounded-xl border p-6"
            style={{ backgroundColor: "#131b2e", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-['Manrope'] text-xl font-bold text-white">Upcoming Visits</h2>
              <button
                type="button"
                onClick={() => onNavigate("schedule")}
                className="text-xs font-semibold text-[#ffb690] hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            {sortedVisits.length === 0 ? (
              <div className="py-6 text-center">
                <CalendarDays size={28} className="mx-auto mb-3 text-slate-500" />
                <p className="text-sm text-slate-400">No visits scheduled.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedVisits.slice(0, 3).map((visit) => (
                  <div
                    key={visit.id}
                    className="rounded-xl border-l-4 border-[#93ccff] p-4 transition-colors hover:bg-slate-800/30"
                    style={{ backgroundColor: "#171f33" }}
                  >
                    <div className="mb-1.5 flex items-start justify-between">
                      <div>
                        <p className="font-['Manrope'] text-sm font-bold text-white">
                          {new Date(visit.scheduledDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-slate-400">
                          {visit.timeWindow === "MORNING" && "Morning (7AM – 11AM)"}
                          {visit.timeWindow === "MIDDAY" && "Midday (11AM – 2PM)"}
                          {visit.timeWindow === "AFTERNOON" && "Afternoon (2PM – 6PM)"}
                        </p>
                      </div>
                      <StatusBadge status={visit.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate("schedule")}
              className="mt-5 w-full rounded-xl border py-3 text-sm font-bold text-slate-400 transition-colors hover:text-[#ffb690] cursor-pointer"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              Manage Calendar
            </button>
          </section>

          {/* Referral Program */}
          <section
            className="relative overflow-hidden rounded-xl border p-6"
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, #131b2e 60%)",
              borderColor: "rgba(249,115,22,0.2)",
            }}
          >
            {/* Background icon watermark */}
            <div className="pointer-events-none absolute -bottom-6 -right-6 opacity-[0.07]">
              <Gift size={100} />
            </div>

            <h2 className="font-['Manrope'] mb-1 text-xl font-bold text-white">Referral Program</h2>
            <p className="mb-5 text-sm text-slate-400">
              Refer 3 friends and get{" "}
              <span className="font-bold italic text-[#ffb690]">1 Month Free</span> on any plan.
            </p>

            {/* Progress */}
            <div className="mb-5">
              <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">Progress</span>
                <span className="text-[#ffb690]">{referralProgress} / 3 Referrals</span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full"
                style={{ backgroundColor: "#2d3449" }}
              >
                <div
                  className="h-full rounded-full bg-[#ffb690] transition-all duration-700"
                  style={{ width: `${(referralProgress / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Referral code */}
            {referral?.referralCode ? (
              <div className="mb-4 flex items-center gap-2">
                <code
                  className="flex-1 rounded-xl px-3 py-2.5 font-mono text-sm font-bold tracking-widest text-[#ffb690]"
                  style={{ backgroundColor: "#2d3449" }}
                >
                  {referral.referralCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
                  style={{ backgroundColor: "#2d3449" }}
                >
                  {copied ? (
                    <Check size={13} className="text-emerald-400" />
                  ) : (
                    <Copy size={13} />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerateCode}
                disabled={generateReferralCodeMutation.isPending}
                className="mb-4 flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
              >
                <Share2 size={14} />
                {generateReferralCodeMutation.isPending ? "Generating..." : "Generate Code"}
              </button>
            )}

            {/* CTA */}
            <button
              type="button"
              onClick={handleGenerateCode}
              className="w-full rounded-xl py-3.5 text-sm font-bold transition-all active:scale-95 hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: "#ffb690",
                color: "#552100",
              }}
            >
              Invite a Friend
            </button>

            {/* Stats */}
            {referral && (
              <div
                className="mt-5 flex gap-6 border-t pt-4"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div>
                  <div className="font-['Manrope'] text-lg font-black text-white">{referral.total}</div>
                  <div className="text-xs text-slate-500">Referred</div>
                </div>
                <div>
                  <div className="font-['Manrope'] text-lg font-black text-white">{referral.converted}</div>
                  <div className="text-xs text-slate-500">Converted</div>
                </div>
                <div>
                  <div className="font-['Manrope'] text-lg font-black text-emerald-400">{referral.freeMonthsEarned}</div>
                  <div className="text-xs text-slate-500">Free Months</div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
