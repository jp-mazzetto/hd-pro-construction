import type { ServiceName } from "../../consts/site";
import { SERVICES } from "../../consts/site";
import ServiceCard from "./ServiceCard";

interface ServicesSectionProps {
  onServiceRequest: (service: ServiceName) => void;
}

/**
 * Secao que lista os servicos da empresa com CTA por item.
 */
const ServicesSection = ({
  onServiceRequest,
}: ServicesSectionProps) => {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gray-50 py-24 text-left md:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute -left-16 top-12 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-gray-900/10 blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="mb-14 max-w-3xl md:mb-16">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.32em] text-orange-600">
            Our Services
          </p>

          <h2 className="mb-5 text-4xl font-black uppercase italic tracking-tighter text-gray-900 md:text-6xl">
            Expert Services
          </h2>

          <p className="max-w-2xl font-medium leading-relaxed text-gray-500 md:text-lg">
            Professional masonry and excavation services for your next outdoor
            project.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.title}
              service={service}
              onRequest={onServiceRequest}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
