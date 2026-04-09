import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

interface AcceptSectionProps {
  hasScrolledToBottom: boolean;
  isChecked: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onCheckedChange: (v: boolean) => void;
  onAccept: () => void;
}

export default function AcceptSection({
  hasScrolledToBottom,
  isChecked,
  isSubmitting,
  submitError,
  onCheckedChange,
  onAccept,
}: AcceptSectionProps) {
  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
      <label
        className={`flex cursor-pointer items-start gap-3 ${!hasScrolledToBottom ? "opacity-40" : ""}`}
      >
        <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            type="checkbox"
            checked={isChecked}
            disabled={!hasScrolledToBottom}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 transition checked:border-orange-500 checked:bg-orange-500 disabled:cursor-not-allowed"
          />
          {isChecked && (
            <CheckCircle2 size={14} className="pointer-events-none absolute text-white" />
          )}
        </div>
        <span className="text-sm leading-relaxed text-gray-300">
          I have read, understood, and agree to the terms of this Service Agreement, including the{" "}
          <strong className="text-white">12-month commitment</strong>,{" "}
          <strong className="text-white">automatic monthly billing</strong>, and the{" "}
          <strong className="text-white">early termination fee</strong> as described above,
          including the <strong className="text-white">Arbitration Agreement (Section 12)</strong>{" "}
          and <strong className="text-white">Section 13</strong>. I acknowledge my right to
          cancel within three business days without penalty.
        </span>
      </label>

      {submitError && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-400/8 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={15} />
          {submitError}
        </p>
      )}

      <button
        type="button"
        disabled={!isChecked || isSubmitting}
        onClick={onAccept}
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-orange-500 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <ShieldCheck size={18} />
        )}
        {isSubmitting ? "Recording acceptance…" : "Accept & Proceed to Payment"}
      </button>

      <p className="mt-3 text-center text-[11px] text-gray-500">
        Your acceptance will be recorded with date, time, and IP address for legal purposes.
      </p>
    </div>
  );
}
