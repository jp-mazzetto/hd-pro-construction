import { useMemo, useState } from "react";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";

import type {
  NavItem,
  Service,
  ServiceName,
  SubscriptionPlanName,
  SubscriptionPlanOffer,
} from "../../consts/site";
import { LAWN_MAINTENANCE_PLANS, SERVICES } from "../../consts/site";
import { usePlansPromotionSection } from "../../hooks/usePlansPromotionSection";
import type { UserSubscription } from "../../types/lib";
import MobileMenu from "../layout/MobileMenu";
import SiteFooter from "../layout/SiteFooter";
import SiteHeader from "../layout/SiteHeader";

type ServiceFilter =
  | "all"
  | "masonry"
  | "site-work"
  | "finishing"
  | "outdoor-living"
  | "lawn-cutting";

type ServiceCategory = Exclude<ServiceFilter, "all">;

interface ServicesViewProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  isAuthenticated: boolean;
  currentSubscription?: UserSubscription | null;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
  onPlanRequest: (planName: SubscriptionPlanName) => void;
  onServiceRequest: (service?: ServiceName) => void;
  onQuestionRequest: () => void;
}

interface FilterOption<T extends string> {
  id: T;
  label: string;
}

interface ProjectServiceItem {
  kind: "project";
  id: string;
  category: ServiceCategory;
  service: Service;
}

interface LawnPlanItem {
  kind: "lawn-plan";
  id: string;
  category: "lawn-cutting";
  plan: SubscriptionPlanOffer;
}

type CatalogItem = ProjectServiceItem | LawnPlanItem;

const SERVICES_PAGE_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Plans", href: "/plans" },
];

const SERVICE_FILTERS: FilterOption<ServiceFilter>[] = [
  { id: "all", label: "All Services" },
  { id: "masonry", label: "Masonry" },
  { id: "site-work", label: "Site Work" },
  { id: "finishing", label: "Finishing" },
  { id: "outdoor-living", label: "Outdoor Living" },
  { id: "lawn-cutting", label: "Lawn Cutting" },
];

const SERVICE_CATEGORY_BY_NAME: Record<ServiceName, ServiceCategory> = {
  Pavers: "masonry",
  "Brick Work": "masonry",
  Walkways: "masonry",
  "Stone Walls": "masonry",
  Excavation: "site-work",
  Fences: "site-work",
  Paint: "finishing",
  Landscape: "outdoor-living",
  Deck: "outdoor-living",
};

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  masonry: "Masonry",
  "site-work": "Site Work",
  finishing: "Finishing",
  "outdoor-living": "Outdoor Living",
  "lawn-cutting": "Lawn Cutting",
};

const PLAN_TIER_COPY: Record<SubscriptionPlanName, string> = {
  "Basic Plan": "Entry Coverage",
  "Standard Plan": "Balanced Coverage",
  "Premium Plan": "Maximum Coverage",
};

const ServicesView = ({
  scrolled,
  isMenuOpen,
  isAuthenticated,
  currentSubscription,
  onMenuToggle,
  onMenuClose,
  onAuthClick,
  onDashboardClick,
  onPlanRequest,
  onServiceRequest,
  onQuestionRequest,
}: ServicesViewProps) => {
  const { hasSubscription, currentPlanTier } = usePlansPromotionSection(currentSubscription);
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");

  const catalogItems = useMemo<CatalogItem[]>(() => {
    const projectServices: ProjectServiceItem[] = SERVICES.map((service) => ({
      kind: "project",
      id: `service-${service.title}`,
      category: SERVICE_CATEGORY_BY_NAME[service.title],
      service,
    }));

    const lawnPlans: LawnPlanItem[] = LAWN_MAINTENANCE_PLANS.map((plan) => ({
      kind: "lawn-plan",
      id: `plan-${plan.tier}`,
      category: "lawn-cutting",
      plan,
    }));

    return [...projectServices, ...lawnPlans];
  }, []);

  const filteredItems = useMemo(() => {
    if (serviceFilter === "all") {
      return catalogItems;
    }

    return catalogItems.filter((item) => item.category === serviceFilter);
  }, [catalogItems, serviceFilter]);

  const resultCount = filteredItems.length;

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-gray-100 selection:bg-orange-600 selection:text-white">
        <SiteHeader
          scrolled={scrolled}
          isMenuOpen={isMenuOpen}
          isAuthenticated={isAuthenticated}
          navItems={SERVICES_PAGE_NAV_ITEMS}
          onMenuToggle={onMenuToggle}
          onAuthClick={onAuthClick}
          onDashboardClick={onDashboardClick}
        />

        <MobileMenu
          isOpen={isMenuOpen}
          isAuthenticated={isAuthenticated}
          navItems={SERVICES_PAGE_NAV_ITEMS}
          onClose={onMenuClose}
          onAuthClick={onAuthClick}
          onDashboardClick={() => {
            onMenuClose();
            onDashboardClick();
          }}
        />

        <main className="pb-24 pt-28 md:pt-32">
          <section className="relative px-6 pb-10">
            <div className="pointer-events-none absolute -left-16 -top-8 h-72 w-72 rounded-full bg-orange-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute right-0 top-16 h-80 w-80 rounded-full bg-slate-700/20 blur-[130px]" />

            <div className="container relative mx-auto">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">
                Expert Services
              </p>
              <h1 className="mt-4 max-w-4xl font-['Manrope'] text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                One catalog. Every field service, including lawn cutting plans.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
                Filter by service type and compare what each offer includes. Monthly lawn cutting
                plans are listed here as a service type so everything stays in one place.
              </p>
            </div>
          </section>

          <section className="px-6">
            <div className="container mx-auto">
              <div className="sticky top-[5.3rem] z-30 rounded-3xl border border-white/10 bg-slate-900/65 p-4 backdrop-blur-xl md:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {SERVICE_FILTERS.map((filter) => (
                    <FilterChip
                      key={filter.id}
                      isActive={serviceFilter === filter.id}
                      onClick={() => setServiceFilter(filter.id)}
                      label={filter.label}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-200">
                    {resultCount} Result{resultCount === 1 ? "" : "s"} available
                  </p>
                  <p className="text-xs text-gray-400">
                    Project services and lawn cutting plans in one stream.
                  </p>
                </div>

                {resultCount === 0 && (
                  <div className="rounded-3xl bg-slate-900 p-10 text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-300">
                      No Items Found
                    </p>
                    <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold text-white">
                      Try another filter combination
                    </h2>
                    <p className="mt-2 text-sm text-gray-300">
                      Change the selected service type or use the floating question button.
                    </p>
                  </div>
                )}

                {resultCount > 0 && (
                  <div>
                    <SectionHeader
                      title="Service Results"
                      subtitle="Every card below is treated as an expert service offer by category."
                    />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {filteredItems.map((item) =>
                        item.kind === "project" ? (
                          <ServiceCatalogCard
                            key={item.id}
                            service={item.service}
                            category={item.category}
                            onRequest={onServiceRequest}
                          />
                        ) : (
                          <PlanServiceCard
                            key={item.id}
                            category={item.category}
                            plan={item.plan}
                            hasSubscription={hasSubscription}
                            isCurrentPlan={currentPlanTier === item.plan.tier}
                            onPlanRequest={onPlanRequest}
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        <button
          type="button"
          onClick={onQuestionRequest}
          className="fixed bottom-5 right-5 z-50 inline-flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-[#ffb690] to-[#f97316] px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#552100] shadow-2xl shadow-orange-900/45 transition hover:scale-105 hover:shadow-orange-800/60"
          aria-label="Ask a question"
        >
          <MessageCircleQuestion size={18} />
          <span className="hidden sm:inline">Ask a Question</span>
        </button>

        <SiteFooter navItems={SERVICES_PAGE_NAV_ITEMS} />
      </div>
    </>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6">
    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-300">{title}</p>
    <p className="mt-2 text-sm text-gray-300">{subtitle}</p>
  </div>
);

const FilterChip = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`cursor-pointer rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] transition ${
      isActive
        ? "border-orange-300/80 bg-orange-500/20 text-orange-100"
        : "border-white/10 bg-transparent text-gray-400 hover:border-white/30 hover:text-white"
    }`}
  >
    {label}
  </button>
);

const TypeBadge = ({ category }: { category: ServiceCategory }) => (
  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 backdrop-blur-sm">
    <TypeGlyph category={category} className="h-4 w-4 text-orange-200" />
    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-orange-100">
      {CATEGORY_LABELS[category]}
    </span>
  </div>
);

const TypeGlyph = ({ category, className }: { category: ServiceCategory; className?: string }) => {
  if (category === "masonry") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M3 7h18M3 12h18M3 17h18M8 7v5M16 12v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (category === "site-work") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M14 3l7 7-3 3-7-7 3-3zM10 7l7 7M4 21h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (category === "finishing") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M4 7h13v5H4zM17 9h3M20 9v8M8 12v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (category === "outdoor-living") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M4 13l8-7 8 7M7 11v8h10v-8M12 14v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 20h18M6 20v-5m4 5v-7m4 7v-4m4 4v-6M4 12c2-2 4-2 6 0M10 10c2-2 4-2 6 0M16 12c2-2 3-2 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ServiceCatalogCard = ({
  service,
  category,
  onRequest,
}: {
  service: Service;
  category: ServiceCategory;
  onRequest: (service?: ServiceName) => void;
}) => (
  <article className="group relative isolate overflow-hidden rounded-4xl border border-slate-700/70 bg-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/45 hover:shadow-2xl">
    {service.imageBefore && service.imageAfter ? (
      <div className="absolute inset-0">
        <img
          src={service.imageBefore}
          alt={`${service.imageAlt} — before`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 translate-x-[-102%] transition-transform duration-800 ease-out group-hover:translate-x-0">
            <img
              src={service.imageAfter}
              alt={`${service.imageAlt} — after`}
              loading="lazy"
              className="h-full w-full object-cover brightness-95 contrast-110 saturate-125 sepia-[0.06]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-orange-500/25 via-transparent to-slate-900/15 mix-blend-screen" />
          </div>
        </div>
      </div>
    ) : (
      <img
        src={service.imageSrc}
        alt={service.imageAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    )}

    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/70 to-slate-950/15" />
    <TypeBadge category={category} />

    <div className="relative flex min-h-96 flex-col justify-end p-7 sm:p-8">
      <h3 className="mt-3 text-3xl font-black uppercase italic tracking-tight text-white">
        {service.title}
      </h3>
      <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-gray-200">{service.desc}</p>
      <button
        type="button"
        onClick={() => onRequest(service.title)}
        className="mt-6 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-orange-400/40 bg-orange-600/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-orange-100 transition-all hover:bg-orange-500 hover:text-white"
      >
        Request Estimate
        <ArrowRight size={16} />
      </button>
    </div>
  </article>
);

const PlanServiceCard = ({
  category,
  plan,
  hasSubscription,
  isCurrentPlan,
  onPlanRequest,
}: {
  category: ServiceCategory;
  plan: SubscriptionPlanOffer;
  hasSubscription: boolean;
  isCurrentPlan: boolean;
  onPlanRequest: (planName: SubscriptionPlanName) => void;
}) => (
  <article className="group relative isolate overflow-hidden rounded-4xl border border-slate-700/70 bg-slate-900 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/45 hover:shadow-2xl">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(249,115,22,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,182,144,0.2),transparent_42%)]" />
    <TypeBadge category={category} />

    <div className="relative pt-11">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">
        {PLAN_TIER_COPY[plan.tier]}
      </p>
      <h3 className="mt-3 font-['Manrope'] text-3xl font-extrabold text-white">{plan.tier}</h3>
      <p className="mt-3 text-4xl font-black text-orange-200">{plan.priceLabel}</p>

      <ul className="mt-5 space-y-3 text-sm text-gray-200">
        <li>{plan.maxSqFtLabel}</li>
        <li>{plan.visitsLabel}</li>
        <li>{plan.bestFor}</li>
      </ul>

      <button
        type="button"
        onClick={() => onPlanRequest(plan.tier)}
        disabled={isCurrentPlan}
        className={`mt-7 w-full cursor-pointer rounded-2xl py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
          isCurrentPlan
            ? "cursor-not-allowed border border-white/10 bg-white/5 text-gray-400"
            : "bg-linear-to-r from-[#ffb690] to-[#f97316] text-[#552100] hover:opacity-90"
        }`}
      >
        {isCurrentPlan
          ? "Current Plan"
          : hasSubscription
            ? "Add Plan for Another Address"
            : "Start This Service"}
      </button>
    </div>
  </article>
);

export default ServicesView;
