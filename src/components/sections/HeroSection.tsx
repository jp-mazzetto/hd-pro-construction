import { MessageSquare, Phone } from "lucide-react";

import { DISPLAY_PHONE, SERVICE_TAGS } from "../../consts/site";
import Button from "../Button";

interface HeroSectionProps {
  onEstimateClick: () => void;
}

/**
 * Secao hero com proposta principal da marca e CTA para solicitar estimativa.
 */
const HeroSection = ({ onEstimateClick }: HeroSectionProps) => {
  return (
    <header className="relative h-screen flex items-center overflow-hidden text-left">
      <div className="absolute inset-0 bg-gray-900">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-block bg-orange-600 text-white font-black px-4 py-1 mb-8 italic skew-x-[-12deg] animate-fade-in uppercase tracking-widest text-sm text-left">
            <span className="inline-block skew-x-[12deg]">
              Professional Excellence
            </span>
          </div>

          <h1 className="text-6xl md:text-[120px] font-black text-white leading-[0.85] mb-8 uppercase italic tracking-tighter drop-shadow-2xl text-left">
            Transforming <br />
            <span className="text-orange-600">Outdoor</span> <br />
            Spaces
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-orange-500 font-black uppercase tracking-widest text-sm mb-10 border-l-4 border-orange-600 pl-6">
            {SERVICE_TAGS.map((serviceTag, index) => (
              <span key={serviceTag}>
                {serviceTag}
                {index < SERVICE_TAGS.length - 1 && " |"}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Button onClick={onEstimateClick} className="text-xl py-6 px-12 group">
              <MessageSquare
                size={28}
                className="group-hover:rotate-12 transition-transform"
              />
              Text for Free Estimate
            </Button>
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                <Phone size={24} className="text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Direct Call
                </p>
                <p className="text-xl font-black tracking-tighter italic">
                  {DISPLAY_PHONE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:block bg-white p-6 rounded-2xl shadow-2xl rotate-3 border-b-8 border-orange-600">
        <p className="text-gray-400 text-[10px] font-black uppercase mb-1">
          Owner & Operator
        </p>
        <p className="text-3xl font-black italic tracking-tighter text-gray-900">
          Dan
        </p>
      </div>
    </header>
  );
};

export default HeroSection;
