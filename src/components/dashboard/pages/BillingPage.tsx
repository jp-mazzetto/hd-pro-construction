import { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, Download, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import type { BillingCycleView } from "../../../types/dashboard";
import {
  createBillingCheckoutSession,
  fetchBillingCycles,
  verifyBillingCheckoutSession,
} from "../../../lib/dashboard-client";
import EmptyState from "../shared/EmptyState";
import BillingSummaryCard from "../billing/BillingSummaryCard";
import BillingNextPaymentCard from "../billing/BillingNextPaymentCard";
import BillingTableRow from "../billing/BillingTableRow";
import BillingPagination from "../billing/BillingPagination";

type FilterStatus = "ALL" | "PENDING" | "PAID" | "OVERDUE" | "WAIVED";

const FILTERS: FilterStatus[] = ["ALL", "PENDING", "PAID", "OVERDUE", "WAIVED"];

/** 12 cycles per page — one full calendar year of monthly billing */
const PAGE_SIZE = 12;

/**
 * BillingPage (Organism / Page component)
 *
 * The main Billing section of the HD Construction dashboard.
 * Fetches billing cycles from the API and composes the full billing
 * overview layout using purpose-built atomic components:
 *
 *  • BillingSummaryCard    — current outstanding balance + quick actions
 *  • BillingNextPaymentCard — next scheduled payment date
 *  • BillingTableRow       — individual cycle row (status-aware CTA)
 *  • BillingPagination     — client-side pagination footer
 */
export default function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cycles, setCycles] = useState<BillingCycleView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);
  const [payingCycleId, setPayingCycleId] = useState<string | null>(null);
  const [handledCheckoutSessionId, setHandledCheckoutSessionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [page, setPage] = useState(0);

  const loadBillingCycles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBillingCycles();
      setCycles(data);
    } catch {
      setError("Failed to load billing history.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBillingCycles();
  }, [loadBillingCycles]);

  useEffect(() => {
    const checkoutStatus = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");

    if (checkoutStatus === "cancel") {
      setCheckoutNotice("Stripe checkout was cancelled. No charges were made.");
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("checkout");
      nextParams.delete("session_id");
      setSearchParams(nextParams, { replace: true });
      return;
    }

    if (
      checkoutStatus !== "success" ||
      !sessionId ||
      handledCheckoutSessionId === sessionId
    ) {
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        await verifyBillingCheckoutSession(sessionId);
        if (!cancelled) {
          setCheckoutNotice("Payment confirmed and billing status updated.");
          setActionError(null);
        }
      } catch {
        if (!cancelled) {
          setCheckoutNotice(
            "Payment completed, but billing status is still syncing with Stripe.",
          );
        }
      } finally {
        if (!cancelled) {
          setHandledCheckoutSessionId(sessionId);
          void loadBillingCycles();
          const nextParams = new URLSearchParams(searchParams);
          nextParams.delete("checkout");
          nextParams.delete("session_id");
          setSearchParams(nextParams, { replace: true });
        }
      }
    };

    void verify();

    return () => {
      cancelled = true;
    };
  }, [handledCheckoutSessionId, loadBillingCycles, searchParams, setSearchParams]);

  const handlePayInAdvance = useCallback(async (cycle: BillingCycleView) => {
    setActionError(null);
    setCheckoutNotice(null);
    setPayingCycleId(cycle.id);

    try {
      const checkout = await createBillingCheckoutSession(cycle.id);
      window.location.href = checkout.checkoutUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start Stripe checkout.";
      setActionError(message);
      setPayingCycleId(null);
    }
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setPage(0);
  }, [filter]);

  /* ── Derived data ─────────────────────────────────────────────────────── */

  const filtered = useMemo(
    () => (filter === "ALL" ? cycles : cycles.filter((c) => c.status === filter)),
    [cycles, filter],
  );

  const paginated = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page],
  );

  /** Total outstanding balance (PENDING + OVERDUE) in cents */
  const balanceInCents = useMemo(
    () =>
      cycles
        .filter((c) => c.status === "PENDING" || c.status === "OVERDUE")
        .reduce((sum, c) => sum + c.amountInCents, 0),
    [cycles],
  );

  /** Earliest PENDING cycle drives the "next payment" date */
  const nextPaymentCycle = useMemo(
    () =>
      cycles
        .filter((c) => c.status === "PENDING")
        .sort((a, b) => a.periodStart.localeCompare(b.periodStart))[0] ?? null,
    [cycles],
  );

  const activeProjectName = nextPaymentCycle?.planName ?? undefined;

  /* ── Loading skeleton ─────────────────────────────────────────────────── */

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 h-40 animate-pulse rounded-xl bg-[#131b2e] md:col-span-7" />
          <div className="col-span-12 h-40 animate-pulse rounded-xl bg-[#171f33] md:col-span-5" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`sk-${i}`} className="h-16 animate-pulse rounded-lg bg-[#131b2e]" />
        ))}
      </div>
    );
  }

  /* ── Error ────────────────────────────────────────────────────────────── */

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  /* ── Empty state ──────────────────────────────────────────────────────── */

  if (cycles.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard size={28} />}
        title="No Billing History"
        description="Your billing history will appear here once you activate a subscription."
      />
    );
  }

  /* ── Main layout ──────────────────────────────────────────────────────── */

  return (
    <div className="space-y-10">
      {checkoutNotice && (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {checkoutNotice}
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {actionError}
        </div>
      )}

      {/* ── Bento stats header ── */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-7">
          <BillingSummaryCard balanceInCents={balanceInCents} />
        </div>
        <div className="col-span-12 md:col-span-5">
          <BillingNextPaymentCard
            nextPaymentDate={nextPaymentCycle?.periodEnd ?? null}
            activeProjectName={activeProjectName}
          />
        </div>
      </div>

      {/* ── Billing history section ── */}
      <section className="space-y-6">
        {/* Section header */}
        <div className="flex items-end justify-between px-1">
          <div>
            <h3 className="font-['Manrope'] text-2xl font-bold tracking-tight text-white">
              Billing History
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Review and manage your construction phase payments.
            </p>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Filter"
              className="rounded-lg p-2 text-slate-500 hover:text-white"
            >
              <SlidersHorizontal size={18} />
            </button>
            <button
              type="button"
              aria-label="Download"
              className="rounded-lg p-2 text-slate-500 hover:text-white"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
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
        <div className="overflow-x-auto rounded-xl border border-white/6 bg-[#0b1326] shadow-2xl">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/6 bg-[#171f33] text-slate-500">
                <th className="px-8 py-5 font-['Manrope'] text-sm font-semibold tracking-wide">
                  PERIOD
                </th>
                <th className="px-8 py-5 text-right font-['Manrope'] text-sm font-semibold tracking-wide">
                  AMOUNT
                </th>
                <th className="px-8 py-5 text-center font-['Manrope'] text-sm font-semibold tracking-wide">
                  STATUS
                </th>
                <th className="px-8 py-5 text-right font-['Manrope'] text-sm font-semibold tracking-wide">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {paginated.length > 0 ? (
                paginated.map((cycle) => (
                  <BillingTableRow
                    key={cycle.id}
                    cycle={cycle}
                    onPayInAdvance={handlePayInAdvance}
                    isPayInAdvanceLoading={payingCycleId === cycle.id}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-slate-500">
                    No invoices match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <BillingPagination
          showing={paginated.length}
          total={filtered.length}
          hasPrev={page > 0}
          hasNext={(page + 1) * PAGE_SIZE < filtered.length}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      </section>

    </div>
  );
}
