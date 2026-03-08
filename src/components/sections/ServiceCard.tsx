import { ChevronRight, Tractor } from "lucide-react";

import type { Service, ServiceName } from "../../consts/site";

interface ServiceCardProps {
  service: Service;
  onRequest: (service: ServiceName) => void;
}

/**
 * Card individual de servico com acao para abrir pedido via SMS.
 */
const ServiceCard = ({ service, onRequest }: ServiceCardProps) => {
  return (
    <article className="group bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-l-8 border-transparent hover:border-orange-600 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Tractor size={120} />
      </div>
      <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter group-hover:text-orange-600 transition-colors">
        {service.title}
      </h3>
      <p className="text-gray-500 font-medium leading-relaxed mb-8">{service.desc}</p>
      <button
        type="button"
        className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all"
        onClick={() => onRequest(service.title)}
      >
        Book Now <ChevronRight size={16} />
      </button>
    </article>
  );
};

export default ServiceCard;
