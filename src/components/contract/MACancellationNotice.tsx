import { AlertCircle } from "lucide-react";

export default function MACancellationNotice() {
  return (
    <div className="mb-6 rounded-2xl border border-yellow-400/25 bg-yellow-400/5 p-5">
      <div className="flex gap-3">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-yellow-400" />
        <div>
          <p className="mb-1 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
            Massachusetts — 3-Business-Day Cancellation Notice
          </p>
          <p className="text-sm leading-relaxed text-yellow-100/80">
            You may cancel this agreement, without any penalty or obligation, within{" "}
            <strong>three business days</strong> from the date you sign below. If you cancel, any
            payments you have made will be returned within{" "}
            <strong>ten business days</strong> of receiving your notice.
          </p>
        </div>
      </div>
    </div>
  );
}
