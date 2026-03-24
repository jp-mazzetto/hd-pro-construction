import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

import type { BillingCycleView } from "../../../types/dashboard";
import { fetchBillingCycles } from "../../../lib/dashboard-client";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";

type FilterStatus = "ALL" | "PENDING" | "PAID" | "OVERDUE" | "WAIVED";

const FILTERS: FilterStatus[] = ["ALL", "PENDING", "PAID", "OVERDUE", "WAIVED"];

export default function BillingPage() {
  const [cycles, setCycles] = useState<BillingCycleView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchBillingCycles();
        if (!cancelled) setCycles(data);
      } catch {
        if (!cancelled) setError("Failed to load billing history.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`sk-${i}`} className="h-14 animate-pulse rounded-lg bg-slate-900" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (cycles.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard size={28} />}
        title="No Billing History"
        description="Your billing history will appear here once you activate a subscription."
      />
    );
  }

  const filtered =
    filter === "ALL" ? cycles : cycles.filter((c) => c.status === filter);

  const totalPaid = cycles
    .filter((c) => c.status === "PAID")
    .reduce((sum, c) => sum + c.amountInCents, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-6 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Paid
          </span>
          <div className="text-lg font-black text-white">
            ${(totalPaid / 100).toFixed(2)}
          </div>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Invoices
          </span>
          <div className="text-lg font-black text-white">{cycles.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              filter === f
                ? "bg-orange-500/15 text-orange-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Period
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Paid
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((cycle) => (
              <tr key={cycle.id} className="bg-slate-900">
                <td className="px-4 py-3 text-white">
                  {new Date(cycle.periodStart).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  &ndash;{" "}
                  {new Date(cycle.periodEnd).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 font-semibold text-white">
                  ${(cycle.amountInCents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={cycle.status} />
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {cycle.paidAt
                    ? new Date(cycle.paidAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No invoices match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
