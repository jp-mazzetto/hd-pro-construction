import { Navigate } from "../router-adapter";
import { ArrowLeft, Loader2, ScrollText } from "lucide-react";

import useContractPage from "../hooks/useContractPage";
import AcceptSection from "../components/contract/AcceptSection";
import ContractBody from "../components/contract/ContractBody";
import MACancellationNotice from "../components/contract/MACancellationNotice";
import PlanBadge from "../components/contract/PlanBadge";

const ContractPage = () => {
  const {
    plan,
    isLoadingPlan,
    planNotFound,
    hasScrolledToBottom,
    isChecked,
    isSubmitting,
    submitError,
    planTier,
    startDate,
    endDate,
    billingDay,
    session,
    isAuthLoading,
    scrollRef,
    setIsChecked,
    handleScroll,
    handleAccept,
    navigateBack,
  } = useContractPage();

  if (!planTier) return <Navigate to="/" replace />;

  if (isAuthLoading || (session && isLoadingPlan)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-orange-400" size={32} />
      </div>
    );
  }

  if (!session) return <Navigate to="/plans" replace />;

  if (planNotFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/3 p-8 text-center">
          <p className="font-['Bebas_Neue'] text-4xl tracking-wide">Plan not found</p>
          <button
            type="button"
            onClick={navigateBack}
            className="mt-4 text-sm text-orange-400 underline"
          >
            Back to plans
          </button>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-125 w-125 rounded-full bg-orange-600/8 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-100 w-100 rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Back */}
        <button
          type="button"
          onClick={navigateBack}
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

        <PlanBadge plan={plan} billingDay={billingDay} />

        <MACancellationNotice />

        <ContractBody
          plan={plan}
          session={session}
          startDate={startDate}
          endDate={endDate}
          billingDay={billingDay}
          scrollRef={scrollRef}
          onScroll={handleScroll}
        />

        {!hasScrolledToBottom && (
          <p className="mt-3 text-center text-xs text-gray-500">
            Scroll to the bottom of the contract to enable acceptance
          </p>
        )}

        <AcceptSection
          hasScrolledToBottom={hasScrolledToBottom}
          isChecked={isChecked}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onCheckedChange={setIsChecked}
          onAccept={handleAccept}
        />
      </div>
    </div>
  );
};

export default ContractPage;
