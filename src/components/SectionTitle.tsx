import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
}

export default function SectionTitle({ children, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter">
        {children}
      </h2>
      <div className="w-32 h-2 bg-orange-600 mx-auto mb-6"></div>
      {subtitle && (
        <p className="text-gray-500 max-w-2xl mx-auto font-medium">{subtitle}</p>
      )}
    </div>
  );
}
