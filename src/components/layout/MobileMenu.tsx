import { X } from "lucide-react";

import { NAV_ITEMS } from "../../consts/site";
import BrandLogo from "../BrandLogo";
import Button from "../Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEstimateClick: () => void;
}

const MobileMenu = ({ isOpen, onClose, onEstimateClick }: MobileMenuProps) => {
  if (!isOpen) {
    return null;
  }

  const handleEstimateClick = () => {
    onEstimateClick();
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
        onClick={handleEstimateClick}
        className="text-xl px-16 py-8 shadow-2xl shadow-orange-500/20"
      >
        FREE ESTIMATE
      </Button>
    </div>
  );
};

export default MobileMenu;
