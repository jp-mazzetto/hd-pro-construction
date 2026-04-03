import { FileText } from "lucide-react";

interface BillingSummaryCardProps {
  /** Total outstanding balance in cents */
  balanceInCents: number;
  /** Called when the user clicks "Statement PDF" */
  onDownloadStatement?: () => void;
  /** Called when the user clicks "Manage Methods" */
  onManageMethods?: () => void;
}

/**
 * BillingSummaryCard (Molecule)
 *
 * Displays the user's current outstanding balance with two primary
 * actions: download a statement PDF and manage payment methods.
 * The left orange border signals that this card is the primary financial
 * status indicator on the billing page.
 */
export default function BillingSummaryCard({
  balanceInCents,
  onDownloadStatement,
  onManageMethods,
}: BillingSummaryCardProps) {
  const formatted = (balanceInCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="dashboard-stat-card rounded-xl border-l-4 border-orange-500 bg-[#131b2e] p-8 shadow-xl">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
        Current Balance
      </p>
      <h2 className="font-['Manrope'] text-5xl font-extrabold tracking-tight text-white">
        {formatted}
      </h2>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onDownloadStatement}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 active:scale-95"
        >
          <FileText size={16} />
          Statement PDF
        </button>
        <button
          type="button"
          onClick={onManageMethods}
          className="rounded-xl bg-[#2d3449] px-5 py-2.5 text-sm font-bold text-[#ffb690] hover:bg-[#31394d] active:scale-95"
        >
          Manage Methods
        </button>
      </div>
    </div>
  );
}
