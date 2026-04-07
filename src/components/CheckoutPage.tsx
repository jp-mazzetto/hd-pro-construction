import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

import { useCheckout } from "../hooks/useCheckout";
import { PlanSummary, CheckoutForm } from "./checkout";

interface CheckoutPageProps {
  planTier: string;
  onBack: () => void;
}

/**
 * CheckoutPage - Main checkout container component.
 * Separates UI from business logic by using custom hooks and sub-components.
 */
const CheckoutPage = ({ planTier, onBack }: CheckoutPageProps) => {
  const {
    form,
    fieldErrors,
    referralCode,
    referralError,
    updateField,
    updateReferralCode,
    dbPlan,
    isLoadingPlan,
    planNotFound,
    isSubmitting,
    error,
    handleSubmitWithAddress,
    handleSubmitWithoutAddress,
  } = useCheckout(planTier);

  const onFormSubmit = () => {
    handleSubmitWithAddress();
  };

  // Plan not found state
  if (planNotFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/3 p-8 text-center shadow-2xl shadow-black/30">
          <p className="font-['Bebas_Neue'] text-4xl tracking-wide">Plan not found</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 inline-flex cursor-pointer items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-orange-300 transition hover:text-orange-200"
          >
            <ArrowLeft size={16} />
            Back to plans
          </button>
        </div>
      </div>
    );
  }

  // No plan loaded yet - should not happen but safety check
  if (!dbPlan && !isLoadingPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/3 p-8 text-center shadow-2xl shadow-black/30">
          <p className="font-['Bebas_Neue'] text-4xl tracking-wide">
            Unable to load plan
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 inline-flex cursor-pointer items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-orange-300 transition hover:text-orange-200"
          >
            <ArrowLeft size={16} />
            Back to plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_8%,rgba(249,115,22,0.2),transparent_28%),radial-gradient(circle_at_90%_16%,rgba(255,255,255,0.08),transparent_20%),linear-gradient(180deg,#090b12_0%,#0c111f_100%)]" />
      <div className="pointer-events-none absolute top-20 -left-35 h-80 w-80 rounded-full bg-orange-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-35 -bottom-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex cursor-pointer items-center gap-2 text-xs font-black uppercase tracking-[0.26em] text-gray-300 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to plans
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-orange-200">
            <ShieldCheck size={14} />
            Encrypted checkout
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-6 py-10 lg:py-14">
        <div className="mx-auto max-w-6xl">
          {/* Page title section */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/3 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-orange-200">
                <Sparkles size={14} />
                Checkout flow
              </p>

              <h1 className="mt-4 font-['Bebas_Neue'] text-5xl leading-[0.9] tracking-[0.04em] text-white sm:text-6xl lg:text-7xl">
                Lock your
                <span className="ml-2 text-orange-400">lawn care slot</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm text-gray-300 sm:text-base">
                Fill in the address now, or continue and link it later from your dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/4 px-5 py-4 text-sm text-gray-300">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-gray-400">
                Current step
              </p>
              <p className="mt-1 font-semibold text-white">Address + Plan confirmation</p>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-8 rounded-2xl border border-red-400/40 bg-red-500/10 px-5 py-4 text-sm text-red-100">
              {error}
            </div>
          )}

          {/* Checkout grid */}
          <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] xl:gap-10">
            {dbPlan && <PlanSummary plan={dbPlan} />}

            <CheckoutForm
              form={form}
              fieldErrors={fieldErrors}
              referralCode={referralCode}
              referralError={referralError}
              isSubmitting={isSubmitting}
              isLoadingPlan={isLoadingPlan}
              isPlanLoaded={!!dbPlan}
              onUpdateField={updateField}
              onReferralCodeChange={updateReferralCode}
              onSubmitWithAddress={onFormSubmit}
              onSubmitWithoutAddress={handleSubmitWithoutAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
