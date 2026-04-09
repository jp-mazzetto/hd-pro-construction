import { ArrowRightLeft, Tag } from "lucide-react";

import { REFERRAL_PROMOTION } from "../../../consts/site";

interface ReferralPromotionCardProps {
  hasSubscription: boolean;
  onActionClick: () => void;
}

/**
 * Bloco promocional de indicacao exibido ao final da secao.
 */
export const ReferralPromotionCard = ({
  hasSubscription,
  onActionClick,
}: ReferralPromotionCardProps) => (
  <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-2">
    <div className="flex flex-col items-center justify-between gap-8 rounded-xl border border-gray-700/30 bg-gray-800/40 px-8 py-10 md:flex-row md:px-12 md:py-12">
      <div className="flex items-center gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10">
          <Tag size={30} className="text-orange-400" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white md:text-3xl">
            {hasSubscription ? (
              "INVITE 3 NEW CUSTOMERS AND EARN A FREE MONTH ON YOUR CURRENT PLAN."
            ) : (
              <ReferralHeadline />
            )}
          </h4>
          <p className="mt-2 text-gray-400">
            {hasSubscription
              ? "Keep your plan running and reduce your cost with referral rewards."
              : REFERRAL_PROMOTION.helperText}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onActionClick}
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-orange-700 px-8 py-4 font-bold text-orange-50 shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-orange-800 active:scale-95"
      >
        <ArrowRightLeft size={18} />
        Invite Your Neighbors
      </button>
    </div>
  </div>
);

/**
 * Variante da headline de indicacao para usuarios sem assinatura ativa.
 */
const ReferralHeadline = () => (
  <>
    {REFERRAL_PROMOTION.headline
      .split("get 1 month of landscape free")
      .map((part, index) =>
        index === 0 ? (
          <span key={index}>
            {part.toUpperCase()}
            <span className="text-orange-400">GET 1 MONTH FREE.</span>
          </span>
        ) : null,
      )}
  </>
);
