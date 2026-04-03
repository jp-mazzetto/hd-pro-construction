import { ChevronLeft, ChevronRight } from "lucide-react";

interface BillingPaginationProps {
  /** Number of records currently visible in the table */
  showing: number;
  /** Total number of billing periods available */
  total: number;
  /** Whether the "Previous" button should be enabled */
  hasPrev: boolean;
  /** Whether the "Next" button should be enabled */
  hasNext: boolean;
  /** Called when the user clicks "Previous" */
  onPrev: () => void;
  /** Called when the user clicks "Next" */
  onNext: () => void;
}

/**
 * BillingPagination (Atom)
 *
 * A simple pagination footer that lives below the Billing History table.
 * Displays a "Showing X of Y billing periods" label on the left and
 * Previous / Next navigation buttons on the right.
 */
export default function BillingPagination({
  showing,
  total,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: BillingPaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 text-sm text-slate-500">
      <span>
        Showing {showing} of {total} billing period{total !== 1 ? "s" : ""}
      </span>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1 transition-colors hover:text-[#ffb690] disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-1 transition-colors hover:text-[#ffb690] disabled:pointer-events-none disabled:opacity-30"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
