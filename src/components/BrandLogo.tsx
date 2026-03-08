import type { SyntheticEvent } from "react";

import logoImg from "../assets/logo.png";

interface BrandLogoProps {
  light?: boolean;
  className?: string;
}

const FALLBACK_LOGO = "https://via.placeholder.com/150?text=HD+PRO";

export default function BrandLogo({
  light = false,
  className = "",
}: BrandLogoProps) {
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = FALLBACK_LOGO;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        <div
          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-lg border-2 ${
            light ? "border-white/20" : "border-gray-200"
          } transition-all duration-300 scale-105`}
        >
          <img
            src={logoImg}
            alt="HD Pro Construction Logo"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
      </div>

      <div className="flex flex-col leading-none text-left">
        <span
          className={`text-2xl md:text-3xl font-black italic tracking-tighter ${
            light ? "text-white" : "text-gray-500"
          }`}
        >
          HD
          <span
            className="text-[22px] text-orange-600"
            style={{
              textShadow: "3px 2px 1px rgba(1, 1, 1, 100)",
            }}
          >
            PRO
          </span>
        </span>

        <span
          className={`text-[10px] font-bold tracking-[0.3em] uppercase ${
            light ? "text-orange-400" : "text-gray-500"
          }`}
        >
          Construction INC
        </span>
      </div>
    </div>
  );
}
