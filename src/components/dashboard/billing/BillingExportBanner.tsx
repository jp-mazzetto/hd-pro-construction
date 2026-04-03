interface BillingExportBannerProps {
  /** Called when the user clicks "Export Analysis" */
  onExport?: () => void;
}

/**
 * BillingExportBanner (Molecule)
 *
 * A full-width promotional banner at the bottom of the Billing page that
 * invites the user to generate a comprehensive cost-analysis report for
 * the entire project duration. The subtle orange gradient accent on the
 * right reinforces the HD Construction brand colour.
 */
export default function BillingExportBanner({ onExport }: BillingExportBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#222a3d] p-8">
      {/* Orange atmospheric gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-orange-500/10 to-transparent"
      />

      <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h4 className="font-['Manrope'] text-xl font-bold text-white">
            Need a detailed breakdown?
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Generate a comprehensive cost analysis for the entire project duration.
          </p>
        </div>
        <button
          type="button"
          onClick={onExport}
          className="shrink-0 rounded-xl border border-orange-500/20 bg-[#31394d] px-8 py-3 font-bold text-white transition-colors hover:border-orange-500/50 active:scale-95"
        >
          Export Analysis
        </button>
      </div>
    </div>
  );
}
