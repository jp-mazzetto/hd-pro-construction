interface BillingNextPaymentCardProps {
  /** ISO date string of the next scheduled payment */
  nextPaymentDate: string | null;
  /** Name of the currently active project/plan */
  activeProjectName?: string;
}

/**
 * BillingNextPaymentCard (Molecule)
 *
 * Shows the date of the next scheduled payment alongside the name of
 * the active construction project. Sits beside BillingSummaryCard in
 * the bento stats grid at the top of the Billing page.
 */
export default function BillingNextPaymentCard({
  nextPaymentDate,
  activeProjectName,
}: BillingNextPaymentCardProps) {
  const formattedDate = nextPaymentDate
    ? new Date(nextPaymentDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="flex flex-col justify-between rounded-xl bg-[#171f33] p-8">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          Next Payment
        </p>
        <p className="font-['Manrope'] text-2xl font-bold text-white">
          {formattedDate}
        </p>
      </div>

      {activeProjectName && (
        <div className="mt-4 rounded-lg border border-white/5 bg-[#0b1326] px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Active Project</span>
            <span className="text-sm font-bold text-orange-400">
              {activeProjectName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
