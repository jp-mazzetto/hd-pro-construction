import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Gift, Share2 } from "lucide-react";

import type { ReferralStatus } from "../../../types/dashboard";
import {
  fetchReferralStatus,
  generateReferralCode,
} from "../../../lib/dashboard-client";
import EmptyState from "../shared/EmptyState";

export default function ReferralsPage() {
  const [status, setStatus] = useState<ReferralStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchReferralStatus();
        if (!cancelled) setStatus(data);
      } catch {
        if (!cancelled) setError("Failed to load referral status.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const { referralCode } = await generateReferralCode();
      setStatus((prev) =>
        prev ? { ...prev, referralCode } : null,
      );
    } catch {
      setError("Failed to generate referral code.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!status?.referralCode) return;
    await navigator.clipboard.writeText(status.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [status]);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-900" />;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (!status) {
    return (
      <EmptyState
        icon={<Gift size={28} />}
        title="Referral Program"
        description="Something went wrong loading your referral status."
      />
    );
  }

  const progress = status.converted % 3;

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-slate-900 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
            <Gift size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              Refer 3, Get 1 Month Free
            </h2>
            <p className="text-sm text-slate-400">
              Share your code with friends and earn free months of service.
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
            <span>Progress to next reward</span>
            <span>{progress}/3 referrals</span>
          </div>
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${(progress / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Referral code */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          Your Referral Code
        </h3>

        {status.referralCode ? (
          <div className="flex items-center gap-3">
            <code className="flex-1 rounded-lg bg-slate-800 px-4 py-3 font-mono text-lg font-bold tracking-widest text-orange-400">
              {status.referralCode}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
          >
            <Share2 size={16} />
            {isGenerating ? "Generating..." : "Generate Code"}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center">
          <div className="text-2xl font-black text-white">
            {status.total}
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Friends Referred
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center">
          <div className="text-2xl font-black text-white">
            {status.converted}
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Converted
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center">
          <div className="text-2xl font-black text-emerald-400">
            {status.freeMonthsEarned}
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Free Months Earned
          </div>
        </div>
      </div>
    </div>
  );
}
