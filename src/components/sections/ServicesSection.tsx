import type { ServiceName } from "../../consts/site";
import { SERVICES } from "../../consts/site";
import SectionTitle from "../SectionTitle";
import ServiceCard from "./ServiceCard";

interface ServicesSectionProps {
  onServiceRequest: (service: ServiceName) => void;
}

const ServicesSection = ({ onServiceRequest }: ServicesSectionProps) => {
  return (
    <section id="services" className="py-32 bg-gray-50 relative text-left">
      <div className="container mx-auto px-6">
        <SectionTitle subtitle="Professional masonry and excavation services for your next outdoor project.">
          Expert Services
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
