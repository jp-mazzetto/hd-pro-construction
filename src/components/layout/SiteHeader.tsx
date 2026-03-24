import { Menu, X } from "lucide-react";

import { NAV_ITEMS } from "../../consts/site";
import BrandLogo from "../BrandLogo";
import Button from "../Button";

interface SiteHeaderProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  isAuthenticated: boolean;
  onMenuToggle: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
}

/**
 * Cabecalho principal com navegacao desktop, CTA e toggle do menu mobile.
 */
const SiteHeader = ({
  scrolled,
  isMenuOpen,
  isAuthenticated,
  onMenuToggle,
  onAuthClick,
  onDashboardClick,
}: SiteHeaderProps) => {
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-white shadow-2xl py-2" : "bg-transparent py-6 text-white"}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <BrandLogo light={!scrolled} className="w-auto h-auto" />

        <div className="hidden lg:flex gap-10 font-black uppercase text-xs tracking-[0.2em] items-center text-left">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-orange-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Button
            onClick={isAuthenticated ? onDashboardClick : onAuthClick}
            variant={scrolled ? "primary" : "secondary"}
            className="py-3 px-6 text-[15px]"
          >
            {isAuthenticated ? "My Account" : "Login"}
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 bg-orange-600 rounded-md text-white"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default SiteHeader;
