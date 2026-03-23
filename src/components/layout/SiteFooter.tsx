import { Instagram, MapPin, MessageSquare, Phone } from "lucide-react";

import {
  DIRECT_SMS_PHONE,
  DISPLAY_PHONE,
  instagramProfileUrl,
  LOCATION_LABEL,
  NAV_ITEMS,
} from "../../consts/site";
import BrandLogo from "../BrandLogo";

/**
 * Rodape institucional com dados de contato, links de navegacao e rede social.
 */
const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white pt-24 pb-12 text-left">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <BrandLogo light className="scale-125 origin-left mb-8" />
            <p className="text-gray-500 max-w-sm font-medium italic mb-8">
              The leading choice for outdoor transformations in Boston. Built
              with integrity, precision, and grit.
            </p>
            <div className="flex gap-4">
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all text-white"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-orange-600 font-black uppercase italic tracking-widest text-sm mb-8">
              Navigation
            </h4>
            <ul className="space-y-4 text-gray-400 font-black uppercase text-xs tracking-widest">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-orange-600 font-black uppercase italic tracking-widest text-sm mb-8">
              Connect
            </h4>
            <ul className="space-y-6 text-gray-400 font-bold">
              <li className="flex items-start gap-3">
                <Phone className="text-orange-600 shrink-0" size={20} />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black italic tracking-tighter text-white uppercase">
                    {DISPLAY_PHONE}
                  </span>
                  <span className="text-[10px] text-gray-600 mt-1">
                    Main Office
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="text-orange-600 shrink-0" size={20} />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black italic tracking-tighter text-white uppercase">
                    {DIRECT_SMS_PHONE}
                  </span>
                  <span className="text-[10px] text-gray-600 mt-1">
                    Direct SMS
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-600 shrink-0" size={20} />
                <span className="text-xs font-black uppercase italic text-white leading-tight">
                  {LOCATION_LABEL}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 font-bold uppercase text-[10px] tracking-[0.3em]">
            © {currentYear} HD PRO CONSTRUCTION INC | Built for Excellence
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
            <a href="#" className="hover:text-orange-600 transition-colors">
              Privacy
            </a>
            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
