import { X } from "lucide-react";

import { NAV_ITEMS } from "../../consts/site";
import BrandLogo from "../BrandLogo";
import Button from "../Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick: () => void;
}

/**
 * Overlay de navegacao mobile com links de secao e CTA de acesso.
 */
const MobileMenu = ({ isOpen, onClose, onAuthClick }: MobileMenuProps) => {
  if (!isOpen) {
    return null;
  }

  const handleAuthClick = () => {
    onAuthClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-[60] flex flex-col items-center justify-center gap-10 text-white">
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={onClose}
        aria-label="Close menu"
      >
        <X size={48} />
      </button>
      <BrandLogo light className="scale-150 mb-10" />
      {NAV_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="text-4xl font-black italic tracking-tighter"
          onClick={onClose}
        >
          {item.label.toUpperCase()}
        </a>
      ))}
      <Button
        onClick={handleAuthClick}
        className="text-xl px-16 py-8 shadow-2xl shadow-orange-500/20"
      >
        LOGIN
      </Button>
    </div>
  );
};

export default MobileMenu;
