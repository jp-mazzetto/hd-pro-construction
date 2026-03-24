import type { NavItem, SubscriptionPlanName } from "../../consts/site";
import { LAWN_MAINTENANCE_PLANS } from "../../consts/site";
import AppSeo from "../AppSeo";
import MobileMenu from "../layout/MobileMenu";
import SiteFooter from "../layout/SiteFooter";
import SiteHeader from "../layout/SiteHeader";
import { PlanCard } from "../sections/plans-promotion";

interface PlansViewProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  isAuthenticated: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
  onPlanRequest: (planName: SubscriptionPlanName) => void;
}

const HOME_SECTION_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const PlansView = ({
  scrolled,
  isMenuOpen,
  isAuthenticated,
  onMenuToggle,
  onMenuClose,
  onAuthClick,
  onDashboardClick,
  onPlanRequest,
}: PlansViewProps) => (
  <>
    <AppSeo />
    <div className="min-h-screen overflow-x-hidden bg-gray-900 font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
      <SiteHeader
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        navItems={HOME_SECTION_NAV_ITEMS}
        onMenuToggle={onMenuToggle}
        onAuthClick={onAuthClick}
        onDashboardClick={onDashboardClick}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        navItems={HOME_SECTION_NAV_ITEMS}
        onClose={onMenuClose}
        onAuthClick={onAuthClick}
        onDashboardClick={() => {
          onMenuClose();
          onDashboardClick();
        }}
      />

      <main>
        <section
          id="plan-selection"
          className="scroll-mt-28 bg-gray-900 px-6 pb-24 pt-28 text-white md:pb-32 md:pt-32"
        >
          <div className="container mx-auto">
            <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">
                  Plans
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                  Built for clean, recurring service
                </h2>
              </div>
              <p className="max-w-xl text-sm font-medium leading-7 text-gray-400 md:text-right">
                Each tier keeps the same straightforward monthly model. Choose the lawn size
                and visit cadence that matches the property, then continue with checkout.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
              {LAWN_MAINTENANCE_PLANS.map((plan) => (
                <PlanCard
                  key={plan.tier}
                  plan={plan}
                  hasSubscription={false}
                  isCurrentPlan={false}
                  isFeatured={plan.tier === "Standard Plan"}
                  onPlanRequest={onPlanRequest}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter navItems={HOME_SECTION_NAV_ITEMS} />
    </div>
  </>
);

export default PlansView;
