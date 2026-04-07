import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ScrollText, ShieldCheck } from "lucide-react";

import { acceptTerms, fetchPlans, fetchTermsStatus } from "../lib/auth-client";
import type { SubscriptionPlan } from "../types/lib";
import useAuth from "../hooks/useAuth";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const fmtDate = (date: Date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 font-['Bebas_Neue'] text-2xl tracking-[0.06em] text-orange-300">
    {children}
  </h2>
);

const Para = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-sm leading-relaxed text-gray-300">{children}</p>
);

const DataRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 border-b border-white/5 py-2 last:border-0">
    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</span>
    <span className="text-right text-sm font-medium text-white">{value}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ContractPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session, isAuthLoading } = useAuth();

  const planTier = searchParams.get("plan");

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [planNotFound, setPlanNotFound] = useState(false);
  const [alreadyAccepted, setAlreadyAccepted] = useState(false);

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const startDate = new Date();
  const endDate = addMonths(startDate, 12);
  const billingDay = startDate.getDate();

  // Load plan + terms status in parallel
  useEffect(() => {
    if (!session || !planTier) return;

    const load = async () => {
      try {
        const [plans, status] = await Promise.all([fetchPlans(), fetchTermsStatus()]);

        if (status.accepted) {
          setAlreadyAccepted(true);
          return;
        }

        const found = plans.find((p) => p.tier === planTier.toUpperCase());
        if (!found) {
          setPlanNotFound(true);
        } else {
          setPlan(found);
        }
      } catch {
        setPlanNotFound(true);
      } finally {
        setIsLoadingPlan(false);
      }
    };

    void load();
  }, [session, planTier]);

  // Redirect if already accepted
  useEffect(() => {
    if (alreadyAccepted && planTier) {
      void navigate(`/checkout?plan=${planTier}`, { replace: true });
    }
  }, [alreadyAccepted, planTier, navigate]);

  // Scroll detection
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || hasScrolledToBottom) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (atBottom) setHasScrolledToBottom(true);
  };

  const handleAccept = async () => {
    if (!isChecked || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await acceptTerms();
      void navigate(`/checkout?plan=${planTier}`, { replace: true });
    } catch {
      setSubmitError("Failed to record your acceptance. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ── Guards ──────────────────────────────────────────────────────────────────
  if (!planTier) return <Navigate to="/" replace />;

  if (isAuthLoading || (session && isLoadingPlan)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-orange-400" size={32} />
      </div>
    );
  }

  if (!session) return <Navigate to={`/plans`} replace />;

  if (planNotFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/3 p-8 text-center">
          <p className="font-['Bebas_Neue'] text-4xl tracking-wide">Plan not found</p>
          <button
            type="button"
            onClick={() => navigate("/plans")}
            className="mt-4 text-sm text-orange-400 underline"
          >
            Back to plans
          </button>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const monthly = fmt(plan.priceInCents);
  const total = fmt(plan.priceInCents * 12);
  const maxDeposit = fmt(Math.round((plan.priceInCents * 12) / 3));
  const maxEarlyTerminationFee = fmt(Math.ceil((plan.priceInCents * 12) / 3));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-orange-600/8 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/plans")}
          className="mb-6 flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to plans
        </button>

        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 ring-1 ring-orange-500/25">
            <ScrollText size={22} className="text-orange-400" />
          </div>
          <div>
            <h1 className="font-['Bebas_Neue'] text-4xl tracking-[0.06em] text-white">
              Service Agreement
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Please read the full contract before proceeding to payment.
            </p>
          </div>
        </div>

        {/* Plan badge */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm">
          <div className="border-b border-white/8 bg-orange-500/10 px-5 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-300">
              Selected Plan
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
            {[
              { label: "Plan", value: plan.name },
              { label: "Monthly", value: monthly },
              { label: "Total (12 mo)", value: total },
              { label: "Billing day", value: `${ordinal(billingDay)} of each month` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-950 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MA 3-day cancellation notice — legally required */}
        <div className="mb-6 rounded-2xl border border-yellow-400/25 bg-yellow-400/5 p-5">
          <div className="flex gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-yellow-400" />
            <div>
              <p className="mb-1 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
                Massachusetts — 3-Business-Day Cancellation Notice
              </p>
              <p className="text-sm leading-relaxed text-yellow-100/80">
                You may cancel this agreement, without any penalty or obligation, within{" "}
                <strong>three business days</strong> from the date you sign below. If you cancel, any
                payments you have made will be returned within{" "}
                <strong>ten business days</strong> of receiving your notice.
              </p>
            </div>
          </div>
        </div>

        {/* Contract body */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[520px] overflow-y-auto rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl sm:p-8"
        >
          {/* Parties */}
          <div className="mb-8 rounded-2xl border border-white/8 bg-white/3 p-5">
            <DataRow label="Service Provider" value="HD Construction LLC — Massachusetts" />
            <DataRow label="Client" value={`${session.actor.name} (${session.actor.email})`} />
            <DataRow label="Plan" value={plan.name} />
            <DataRow label="Property address" value="As provided during checkout setup" />
            <DataRow label="Contract start" value={fmtDate(startDate)} />
            <DataRow label="Contract end" value={fmtDate(endDate)} />
            <DataRow label="Duration" value="12 months" />
          </div>

          {/* 1. General Terms */}
          <section className="mb-8">
            <SectionTitle>1. General Terms of Service</SectionTitle>
            <Para>
              This Service Agreement ("Agreement") is entered into between HD Construction LLC
              ("Service Provider") and the client identified above ("Client"), and governs the
              provision of residential lawn maintenance and landscaping services in the Commonwealth
              of Massachusetts.
            </Para>
            <Para>
              The Service Provider agrees to perform the services described herein at the property
              address provided by the Client during checkout setup. Services will be performed with
              reasonable care and skill, in accordance with industry standards.
            </Para>
            <Para>
              This Agreement constitutes the entire agreement between the parties regarding the
              subject matter herein and supersedes all prior discussions, representations, or
              agreements. Any modification must be made in writing and signed by both parties.
            </Para>
          </section>

          {/* 2. Services */}
          <section className="mb-8">
            <SectionTitle>2. Services Included</SectionTitle>
            <Para>
              Under the <strong className="text-white">{plan.name}</strong>, the Service Provider
              will perform the following services at the Client's property (up to{" "}
              {plan.maxSqFt.toLocaleString()} sq ft), at a frequency of {plan.visitsPerMonth}{" "}
              {plan.visitsPerMonth === 1 ? "visit" : "visits"} per month:
            </Para>
            <ul className="mb-3 space-y-2 pl-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 size={14} className="shrink-0 text-orange-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Para>
              Services not listed above are not included and may be quoted separately upon request.
            </Para>
          </section>

          {/* 3. Billing */}
          <section className="mb-8">
            <SectionTitle>3. Billing &amp; Payments</SectionTitle>
            <Para>
              The Client agrees to pay <strong className="text-white">{monthly} per month</strong>{" "}
              for the duration of this Agreement, totaling{" "}
              <strong className="text-white">{total}</strong> over 12 months.
            </Para>
            <Para>
              Payments will be processed automatically via Stripe on the{" "}
              <strong className="text-white">{ordinal(billingDay)}</strong> of each month — the same
              day the subscription begins. No manual action is required from the Client for recurring
              payments.
            </Para>
            <Para>
              The maximum deposit or advance payment required shall not exceed one-third of the total
              contract value (<strong className="text-white">{maxDeposit}</strong>), in compliance
              with Massachusetts law.
            </Para>
            <Para>
              If a payment fails, the Service Provider will notify the Client and a grace period will
              be applied before the subscription is suspended. Repeated non-payment may result in
              termination of this Agreement.
            </Para>
          </section>

          {/* 4. Early Termination */}
          <section className="mb-8">
            <SectionTitle>4. Early Termination &amp; Cancellation</SectionTitle>
            <Para>
              This Agreement commits both parties for a period of{" "}
              <strong className="text-white">12 months</strong>. The agreement does not renew
              automatically at the end of the term.
            </Para>
            <Para>
              Should the Client cancel this Agreement before the end of the 12-month term, an early
              termination fee will apply in the amount of{" "}
              <strong className="text-white">one-third (1/3) of the remaining months</strong> in
              the commitment period, in addition to payment for services already rendered.
              For this plan, the maximum possible fee at contract start is{" "}
              <strong className="text-white">{maxEarlyTerminationFee}</strong>.
            </Para>
            <Para>
              If any discounts were applied based on the Client's commitment to the full term, the
              Service Provider reserves the right to recover the difference between the discounted
              rate and the standard per-visit rate for services already performed.
            </Para>
            <Para>
              The Service Provider may terminate this Agreement with 30 days' written notice if the
              Client breaches any material term and fails to cure the breach within 15 days of
              written notice.
            </Para>
          </section>

          {/* 5. Loyalty Program */}
          <section className="mb-8">
            <SectionTitle>5. Loyalty &amp; Referral Program</SectionTitle>
            <Para>
              The Client may participate in the HD Construction referral program. For every{" "}
              <strong className="text-white">3 successful referrals</strong> — new clients who
              activate a paid subscription — the referring Client will receive{" "}
              <strong className="text-white">1 month of service at no charge</strong>, applied
              automatically to their next billing cycle.
            </Para>
            <Para>
              Referral rewards are subject to the referred client maintaining an active subscription.
              The Service Provider reserves the right to modify or discontinue the referral program
              with 30 days' notice. Earned but unapplied rewards will be honored for 90 days
              following any program discontinuation.
            </Para>
          </section>

          {/* 6. Force Majeure */}
          <section className="mb-8">
            <SectionTitle>6. Force Majeure</SectionTitle>
            <Para>
              Neither party shall be liable for failure or delay in performing their obligations if
              such failure or delay arises from causes beyond their reasonable control, including but
              not limited to extreme weather conditions, natural disasters, acts of government, or
              other events outside either party's control. In such cases, the affected party shall
              notify the other promptly and services shall resume as soon as reasonably practicable.
            </Para>
          </section>

          {/* 7. Insurance & Liability */}
          <section className="mb-8">
            <SectionTitle>7. Insurance &amp; Liability</SectionTitle>
            <Para>
              The Service Provider maintains general liability insurance and workers' compensation
              coverage as required by the Commonwealth of Massachusetts, protecting both the Client
              and the Service Provider's employees during service delivery.
            </Para>
            <Para>
              The Service Provider's liability under this Agreement shall be limited to the value of
              services rendered in the month in which any incident occurs. The Service Provider is
              not liable for pre-existing property conditions, damage caused by Client-directed
              activities, or acts of force majeure.
            </Para>
          </section>

          {/* 8. Consumer Protection */}
          <section className="mb-8">
            <SectionTitle>8. Consumer Protection — Chapter 93A</SectionTitle>
            <Para>
              This Agreement is subject to the Massachusetts Consumer Protection Act (M.G.L. Chapter
              93A), which prohibits unfair or deceptive trade practices. Clients retain all rights
              afforded under Chapter 93A, including the right to bring a civil action and seek
              damages for any violation of such rights.
            </Para>
          </section>

          {/* 9. Governing Law */}
          <section className="mb-4">
            <SectionTitle>9. Governing Law</SectionTitle>
            <Para>
              This Agreement shall be governed by and construed in accordance with the laws of the{" "}
              <strong className="text-white">Commonwealth of Massachusetts</strong>, without regard
              to its conflict of laws provisions. Any disputes arising under this Agreement shall be
              resolved in the appropriate courts of Massachusetts.
            </Para>
          </section>
        </div>

        {/* Scroll prompt */}
        {!hasScrolledToBottom && (
          <p className="mt-3 text-center text-xs text-gray-500">
            Scroll to the bottom of the contract to enable acceptance
          </p>
        )}

        {/* Accept section */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
          <label
            className={`flex cursor-pointer items-start gap-3 ${
              !hasScrolledToBottom ? "opacity-40" : ""
            }`}
          >
            <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={isChecked}
                disabled={!hasScrolledToBottom}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 transition checked:border-orange-500 checked:bg-orange-500 disabled:cursor-not-allowed"
              />
              {isChecked && (
                <CheckCircle2
                  size={14}
                  className="pointer-events-none absolute text-white"
                />
              )}
            </div>
            <span className="text-sm leading-relaxed text-gray-300">
              I have read, understood, and agree to the terms of this Service Agreement, including the{" "}
              <strong className="text-white">12-month commitment</strong>,{" "}
              <strong className="text-white">automatic monthly billing</strong>, and the{" "}
              <strong className="text-white">early termination fee</strong> as described above. I
              acknowledge my right to cancel within three business days without penalty.
            </span>
          </label>

          {submitError && (
            <p className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-400/8 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={15} />
              {submitError}
            </p>
          )}

          <button
            type="button"
            disabled={!isChecked || isSubmitting}
            onClick={handleAccept}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-orange-500 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ShieldCheck size={18} />
            )}
            {isSubmitting ? "Recording acceptance…" : "Accept & Proceed to Payment"}
          </button>

          <p className="mt-3 text-center text-[11px] text-gray-500">
            Your acceptance will be recorded with date, time, and IP address for legal purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;
