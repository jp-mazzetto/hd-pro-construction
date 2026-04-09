interface PlansPromotionHeaderProps {
  hasSubscription: boolean;
}

/**
 * Header principal da secao de planos.
 * Ajusta titulo e texto de apoio conforme o estado de assinatura do usuario.
 */
export const PlansPromotionHeader = ({
  hasSubscription,
}: PlansPromotionHeaderProps) => (
  <div className="mb-10 md:mb-12">
    <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
      Plans
    </p>
    <h2 className="mt-3 text-3xl font-black uppercase italic tracking-tight sm:text-4xl">
      {hasSubscription ? "Need service for another address?" : "Choose Your Lawn Plan"}
    </h2>
    <p className="mt-3 max-w-2xl text-gray-400">
      {hasSubscription
        ? "You already have an active plan. Start another plan to cover an additional property."
        : "Start with a monthly plan and activate service after secure Stripe checkout."}
    </p>
  </div>
);
