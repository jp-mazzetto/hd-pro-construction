import { ArrowRight, AlertCircle } from "lucide-react";

import type { BillingCycleView } from "../../../types/dashboard";
import StatusBadge from "../shared/StatusBadge";

interface BillingTableRowProps {
  /** The billing cycle data for this row */
  cycle: BillingCycleView;
  /** Called when the user clicks the action button for an OVERDUE cycle */
  onResolve?: (cycle: BillingCycleView) => void;
  /** Called when the user clicks "Pay in Advance" on a PENDING cycle */
  onPayInAdvance?: (cycle: BillingCycleView) => void;
  /** Whether pay in advance action is available for this cycle */
  canPayInAdvance?: boolean;
  /** Loading state for pay in advance redirect */
  isPayInAdvanceLoading?: boolean;
}

/** Formats a date range string like "Mar 3 – Apr 3, 2027" */
function formatPeriod(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const startStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = e.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

/** Derives a human-readable sub-label for the period cell */
function periodSubLabel(cycle: BillingCycleView): string {
  if (cycle.status === "PENDING") return "Scheduled Phase";
  if (cycle.paidAt) {
    return `Paid ${new Date(cycle.paidAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
  return cycle.id.slice(0, 12).toUpperCase();
}

/**
 * BillingTableRow (Molecule)
 *
 * A single row inside the Billing History table. Renders the billing
 * period, amount, a StatusBadge, and a context-sensitive action button
 * that changes depending on whether the cycle is OVERDUE, PENDING, or
 * PAID / WAIVED.
 */
export default function BillingTableRow({
  cycle,
  onResolve,
  onPayInAdvance,
  canPayInAdvance = true,
  isPayInAdvanceLoading = false,
}: BillingTableRowProps) {
  const amount = (cycle.amountInCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <tr className="group transition-colors duration-200 hover:bg-white/2">
      {/* Period */}
      <td className="px-8 py-6">
        <div className="flex flex-col">
          <span className="font-['Manrope'] text-base font-semibold text-white">
            {formatPeriod(cycle.periodStart, cycle.periodEnd)}
          </span>
          <span className="mt-0.5 text-xs text-slate-500">
            {periodSubLabel(cycle)}
          </span>
        </div>
      </td>

      {/* Amount */}
      <td className="px-8 py-6 text-right">
        <span className="font-['Manrope'] text-lg font-bold text-white">
          {amount}
        </span>
      </td>

      {/* Status */}
      <td className="px-8 py-6">
        <div className="flex justify-center">
          <StatusBadge status={cycle.status} />
        </div>
      </td>

      {/* Action */}
      <td className="px-8 py-6 text-right">
        {cycle.status === "OVERDUE" && (
          <button
            type="button"
            onClick={() => onResolve?.(cycle)}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:brightness-110 active:scale-95"
          >
            <AlertCircle size={13} />
            Resolve Now
          </button>
        )}

        {cycle.status === "PENDING" && (
          canPayInAdvance && (
            <button
              type="button"
              disabled={isPayInAdvanceLoading}
              onClick={() => onPayInAdvance?.(cycle)}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowRight size={13} />
              {isPayInAdvanceLoading ? "Redirecting..." : "Pay in Advance"}
            </button>
          )
        )}
      </td>
    </tr>
  );
}
