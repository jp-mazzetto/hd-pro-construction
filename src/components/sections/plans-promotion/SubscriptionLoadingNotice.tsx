import { Loader2 } from "lucide-react";

/**
 * Feedback visual enquanto os dados de assinatura estao sendo carregados.
 */
export const SubscriptionLoadingNotice = () => (
  <div className="mb-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-gray-800/40 px-5 py-4 text-sm text-gray-300">
    <Loader2 size={16} className="animate-spin text-orange-400" />
    Loading your subscription details...
  </div>
);
