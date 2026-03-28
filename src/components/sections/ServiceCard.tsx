import { ChevronRight } from "lucide-react";

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
    <article className="group relative isolate min-h-[24rem] overflow-hidden rounded-[2rem] bg-gray-900 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <img
        src={service.imageSrc}
        alt={service.imageAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/65 to-gray-950/20 transition-all duration-500 group-hover:from-gray-950/95 group-hover:via-gray-900/50" />

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-end p-7 sm:p-8">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-orange-300">
          HD Pro Construction
        </p>

        <h3 className="mb-3 text-3xl font-black uppercase italic tracking-tighter text-white transition-colors duration-300 group-hover:text-orange-300">
          {service.title}
        </h3>

        <p className="max-w-[32ch] text-sm font-medium leading-relaxed text-gray-200">
          {service.desc}
        </p>

        <button
          type="button"
          className="mt-7 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-orange-400/40 bg-orange-600/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-orange-200 transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          onClick={() => onRequest(service.title)}
        >
          Book Now <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
};

export default ServiceCard;
